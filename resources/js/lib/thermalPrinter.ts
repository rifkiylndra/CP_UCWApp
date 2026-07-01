import type { KanbanOrder } from "@/types/staff";

// ESC/POS Command Constants for Thermal Printer (Bluetooth Direct)
const ESC = 0x1B;
const GS = 0x1D;

const PRINTER_INIT = new Uint8Array([ESC, 0x40]);
const TXT_ALIGN_LEFT = new Uint8Array([ESC, 0x61, 0x00]);
const TXT_ALIGN_CENTER = new Uint8Array([ESC, 0x61, 0x01]);
const TXT_ALIGN_RIGHT = new Uint8Array([ESC, 0x61, 0x02]);
const TXT_BOLD_ON = new Uint8Array([ESC, 0x45, 0x01]);
const TXT_BOLD_OFF = new Uint8Array([ESC, 0x45, 0x00]);
const TXT_SIZE_DOUBLE = new Uint8Array([GS, 0x21, 0x11]); // Double height and double width
const TXT_SIZE_NORMAL = new Uint8Array([GS, 0x21, 0x00]);
const FEED_PAPER_AND_CUT = new Uint8Array([0x0A, 0x0A, 0x0A, 0x0A, GS, 0x56, 0x42, 0x00]); // 4 line feeds and cut

// Encoder to convert Text to Uint8Array (using Windows-1252 / ASCII compatible encoding)
function encodeText(text: string): Uint8Array {
  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else {
      // Basic translation for common non-ASCII chars
      bytes.push(63); // '?'
    }
  }
  return new Uint8Array(bytes);
}

// Combine multiple Uint8Arrays into one
function combineArrays(arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Direct printing via Web Bluetooth API (GATT ESC/POS)
 */
export async function printViaBluetooth(order: KanbanOrder): Promise<void> {
  if (!navigator.bluetooth) {
    throw new Error("Web Bluetooth API tidak didukung di browser ini. Gunakan Print Browser/PDF.");
  }

  const device = await navigator.bluetooth.requestDevice({
    filters: [
      { namePrefix: "Thermal" },
      { namePrefix: "Printer" },
      { namePrefix: "MTP" },
      { namePrefix: "RPP" },
      { namePrefix: "PT-" },
      { namePrefix: "Bluetooth" }
    ],
    optionalServices: [
      "000018f0-0000-1000-8000-00805f9b34fb", // Custom service uuid common in Bluetooth printers
      "0000e7e1-0000-1000-8000-00805f9b34fb"
    ]
  });

  const server = await device.gatt?.connect();
  if (!server) throw new Error("Gagal menyambungkan ke printer.");

  // Get primary service (detect from common services)
  let service;
  try {
    service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
  } catch {
    try {
      service = await server.getPrimaryService("0000e7e1-0000-1000-8000-00805f9b34fb");
    } catch {
      // Fallback to list services if possible, or throw
      throw new Error("Layanan GATT printer tidak ditemukan. Gunakan Fallback Print Browser.");
    }
  }

  // Get characteristic for write
  const characteristics = await service.getCharacteristics();
  const writeCharacteristic = characteristics.find(c => c.properties.write || c.properties.writeWithoutResponse);
  if (!writeCharacteristic) throw new Error("Tidak dapat menemukan karakteristik write pada printer.");

  // Build ESC/POS Bytes
  const chunks: Uint8Array[] = [];
  
  chunks.push(PRINTER_INIT);
  
  // Header Cafe
  chunks.push(TXT_ALIGN_CENTER);
  chunks.push(TXT_SIZE_DOUBLE);
  chunks.push(TXT_BOLD_ON);
  chunks.push(encodeText("UCW CAFE\n"));
  chunks.push(TXT_SIZE_NORMAL);
  chunks.push(TXT_BOLD_OFF);
  chunks.push(encodeText("================================\n"));
  
  // Metadata Order
  chunks.push(TXT_ALIGN_LEFT);
  chunks.push(encodeText(`Order ID : #${order.orderId}\n`));
  chunks.push(encodeText(`Tanggal  : ${order.placedAt || new Date().toLocaleString("id-ID")}\n`));
  chunks.push(encodeText(`Meja     : ${order.tableLabel}\n`));
  chunks.push(encodeText(`Tipe     : ${order.orderType === "dine-in" ? "Dine-in" : "Takeaway"}\n`));
  chunks.push(encodeText(`Nama     : ${order.customerName || "-"}\n`));
  chunks.push(encodeText("--------------------------------\n"));
  
  // Items
  chunks.push(TXT_BOLD_ON);
  order.items.forEach(item => {
    chunks.push(encodeText(`${item.quantity}x ${item.menuItem.name}\n`));
    chunks.push(TXT_BOLD_OFF);
    if (item.milkChoice || item.sweetener) {
      const opts = [item.milkChoice, item.sweetener].filter(Boolean).join(", ");
      chunks.push(encodeText(`   (${opts})\n`));
    }
    if (item.notes) {
      chunks.push(encodeText(`   * Catatan: ${item.notes}\n`));
    }
    chunks.push(TXT_BOLD_ON);
  });
  chunks.push(TXT_BOLD_OFF);
  
  chunks.push(encodeText("--------------------------------\n"));
  
  // Total & Status
  chunks.push(TXT_ALIGN_RIGHT);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  chunks.push(encodeText(`Total Item: ${totalItems}\n`));
  chunks.push(TXT_BOLD_ON);
  chunks.push(encodeText(`Total: Rp ${new Intl.NumberFormat("id-ID").format(order.totalAmount)}\n`));
  chunks.push(TXT_BOLD_OFF);
  chunks.push(TXT_ALIGN_CENTER);
  chunks.push(encodeText(`\nStatus Pembayaran: ${order.isPaid ? "PAID (LUNAS)" : "UNPAID"}\n`));
  chunks.push(encodeText("================================\n"));
  chunks.push(encodeText("  Terima Kasih Atas Kunjungan  \n"));
  chunks.push(encodeText("             Anda!              \n\n"));
  
  chunks.push(FEED_PAPER_AND_CUT);

  const payload = combineArrays(chunks);

  // Send bytes in chunks of 20 bytes (standard BLE limit)
  const chunkSize = 20;
  for (let i = 0; i < payload.length; i += chunkSize) {
    const slice = payload.slice(i, i + chunkSize);
    await writeCharacteristic.writeValue(slice);
  }

  // Disconnect
  await server.disconnect();
}

/**
 * Universal browser print fallback (styled 58mm/80mm receipt)
 */
export function printViaBrowser(order: KanbanOrder): void {
  // Create an iframe to print the receipt cleanly without page reload or styling leak
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    throw new Error("Gagal membuat dokumen cetak.");
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("id-ID").format(order.totalAmount);
  
  const itemsHtml = order.items.map(item => `
    <div style="margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; font-weight: bold;">
        <span>${item.quantity}x ${item.menuItem.name}</span>
        <span>Rp ${new Intl.NumberFormat("id-ID").format(item.menuItem.price * item.quantity)}</span>
      </div>
      ${(item.milkChoice || item.sweetener) ? `
        <div style="font-size: 11px; color: #555; padding-left: 15px; font-style: italic;">
          Option: ${[item.milkChoice, item.sweetener].filter(Boolean).join(", ")}
        </div>
      ` : ''}
      ${item.notes ? `
        <div style="font-size: 11px; color: #d97706; padding-left: 15px; font-weight: bold;">
          Catatan: ${item.notes}
        </div>
      ` : ''}
    </div>
  `).join('');

  const receiptHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt #${order.orderId}</title>
        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            color: #000;
            background: #fff;
            width: 58mm;
            padding: 8px;
            box-sizing: border-box;
            margin: 0;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .title { font-size: 16px; margin: 0 0 2px 0; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
          .flex-between { display: flex; justify-content: space-between; }
          .header-info { font-size: 11px; line-height: 1.3; }
        </style>
      </head>
      <body>
        <div class="center bold title">UCW CAFE</div>
        <div class="center" style="font-size: 10px; margin-bottom: 4px;">UCW Co-working & Cafe</div>
        <div class="divider"></div>
        
        <div class="header-info">
          <div><b>ORDER:</b> #${order.orderId}</div>
          <div><b>DATE:</b> ${order.placedAt || new Date().toLocaleString("id-ID")}</div>
          <div><b>TABLE:</b> ${order.tableLabel}</div>
          <div><b>TYPE:</b> ${order.orderType === "dine-in" ? "Dine-in" : "Takeaway"}</div>
          <div><b>NAME:</b> ${order.customerName || "-"}</div>
        </div>
        
        <div class="divider"></div>
        
        <div>
          ${itemsHtml}
        </div>
        
        <div class="divider"></div>
        
        <div class="flex-between">
          <span>Total Item:</span>
          <span>${totalItems}</span>
        </div>
        <div class="flex-between bold" style="font-size: 13px; margin-top: 2px;">
          <span>TOTAL:</span>
          <span>Rp ${formattedTotal}</span>
        </div>
        
        <div class="divider"></div>
        <div class="center bold" style="font-size: 13px; margin: 6px 0;">
          PAYMENT: ${order.isPaid ? "PAID (LUNAS)" : "UNPAID"}
        </div>
        <div class="divider"></div>
        
        <div class="center" style="font-size: 10px; line-height: 1.2;">
          Terima kasih atas kunjungan Anda!<br>
          Follow IG kami: @ucw.cafe
        </div>
        <div style="height: 30px;"></div>
      </body>
    </html>
  `;

  doc.open();
  doc.write(receiptHtml);
  doc.close();

  // Print once standard assets load
  iframe.contentWindow?.focus();
  
  // Timeout ensures writing buffers flush properly in all browser engine ports
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Remove the iframe after printing dialog closes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 350);
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemConfigController extends Controller
{
    /**
     * Display system configuration page
     */
    public function index()
    {
        $configs = SystemConfig::all()->pluck('value', 'key');
        
        return Inertia::render('Admin/SystemConfig', [
            'configs' => $configs,
        ]);
    }

    /**
     * Get all system configurations
     */
    public function getAll()
    {
        $configs = SystemConfig::all()->pluck('value', 'key');
        
        return response()->json($configs);
    }

    /**
     * Get specific configuration value
     */
    public function get($key)
    {
        $config = SystemConfig::where('key', $key)->first();
        
        if (!$config) {
            return response()->json([
                'success' => false,
                'message' => 'Configuration not found',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'key' => $config->key,
            'value' => $config->value,
        ]);
    }

    /**
     * Update system configuration
     */
    public function update(Request $request, $key)
    {
        $request->validate([
            'value' => 'required|string',
        ]);

        try {
            $config = SystemConfig::updateOrCreate(
                ['key' => $key],
                ['value' => $request->value]
            );

            Log::info('System configuration updated', [
                'key' => $key,
                'value' => $request->value,
                'updated_by' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Configuration updated successfully',
                'config' => $config,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating system configuration: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update configuration: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update multiple configurations
     */
    public function updateMultiple(Request $request)
    {
        $request->validate([
            'configs' => 'required|array',
        ]);

        try {
            $updated = [];
            
            foreach ($request->configs as $key => $value) {
                $config = SystemConfig::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
                
                $updated[] = $config;
            }

            Log::info('Multiple system configurations updated', [
                'keys' => array_keys($request->configs),
                'updated_by' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Configurations updated successfully',
                'updated' => $updated,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating multiple configurations: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update configurations: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get system settings for frontend
     */
    public function getSettings()
    {
        $settings = SystemConfig::whereIn('key', [
            'store_name',
            'store_address',
            'store_phone',
            'store_email',
            'opening_hours',
            'closing_hours',
            'tax_percentage',
            'service_charge',
            'currency',
            'timezone',
            'maintenance_mode',
            'allow_cash_payment',
            'allow_online_payment',
            'min_order_amount',
            'max_order_amount',
        ])->pluck('value', 'key');
        
        return response()->json($settings);
    }

    /**
     * Get payment settings
     */
    public function getPaymentSettings()
    {
        $settings = SystemConfig::where('key', 'like', 'payment_%')
            ->orWhere('key', 'like', 'midtrans_%')
            ->pluck('value', 'key');
        
        return response()->json($settings);
    }

    /**
     * Update payment settings
     */
    public function updatePaymentSettings(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        try {
            $updated = [];
            
            foreach ($request->settings as $key => $value) {
                if (str_starts_with($key, 'payment_') || str_starts_with($key, 'midtrans_')) {
                    $config = SystemConfig::updateOrCreate(
                        ['key' => $key],
                        ['value' => $value]
                    );
                    
                    $updated[] = $config;
                }
            }

            Log::info('Payment settings updated', [
                'keys' => array_keys($request->settings),
                'updated_by' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment settings updated successfully',
                'updated' => $updated,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating payment settings: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment settings: ' . $e->getMessage(),
            ], 500);
        }
    }
}
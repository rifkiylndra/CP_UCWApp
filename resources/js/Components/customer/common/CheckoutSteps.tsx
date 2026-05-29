interface Props {
    activeStep: 1 | 2 | 3;
}

export default function CheckoutSteps({ activeStep }: Props) {
    const steps = ['Cart', 'Details', 'Payment'];

    return (
        <div className="flex items-center gap-2">
            {steps.map((step, index) => {
                const number = index + 1;
                const active = number === activeStep;
                const done = number < activeStep;

                return (
                    <div key={step} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{
                                    backgroundColor: active || done
                                        ? 'var(--color-ucw-dark)'
                                        : 'var(--color-ucw-border)',
                                    color: active || done
                                        ? 'white'
                                        : 'var(--color-ucw-text-muted)',
                                }}
                            >
                                {done ? '✓' : number}
                            </div>

                            <span
                                className="text-xs font-medium"
                                style={{
                                    color: active
                                        ? 'var(--color-ucw-dark)'
                                        : 'var(--color-ucw-text-muted)',
                                }}
                            >
                                {step}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className="w-6 h-px"
                                style={{ backgroundColor: 'var(--color-ucw-border)' }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
import * as React from 'react';

interface DripButtonProps { // Fixed: PascalCase (Starts with Uppercase)
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'accent';
}

export const DripButton: React.FC<DripButtonProps> = ({ title, onPress, variant = 'primary' }) => {
    const isPrimary = variant === 'primary';

    return (
        <button
            onClick={onPress}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg mb-4 ${
                isPrimary
                    ? 'bg-primary text-white hover:bg-blue-900'
                    : 'bg-accent text-primary hover:bg-cyan-200'
            }`}
        >
            {title}
        </button>
    );
};
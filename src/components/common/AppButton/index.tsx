import React from 'react';
import { Button, ButtonProps } from 'antd';

export interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  btnVariant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const AppButton: React.FC<AppButtonProps> = ({
  btnVariant = 'primary',
  children,
  style,
  ...props
}) => {
  let customStyle = { ...style };

  if (btnVariant === 'secondary') {
    customStyle = {
      backgroundColor: '#7546B8',
      borderColor: '#7546B8',
      color: '#FFFFFF',
      ...style,
    };
  }

  return (
    <Button
      type={btnVariant === 'secondary' ? 'primary' : props.type || (btnVariant === 'primary' ? 'primary' : 'default')}
      danger={btnVariant === 'danger'}
      style={customStyle}
      {...props}
    >
      {children}
    </Button>
  );
};

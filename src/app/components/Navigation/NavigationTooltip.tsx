import React from 'react';
import { Tooltip } from '@nextui-org/react';

type NavigationTooltipProps = {
  children: React.ReactNode;
  content: string;
};

const NavigationTooltip = ({ children, content }: NavigationTooltipProps) => {
  return (
    <Tooltip
      content={content}
      showArrow={false}
      placement='right'
      offset={-12}
      delay={0}
      closeDelay={0}
      classNames={{
        content: [
          'py-2 px-4',
          'text-black rounded-2xl bg-blue3 font-medium text-xs',
        ],
      }}
    >
      {children}
    </Tooltip>
  );
};

export default NavigationTooltip;

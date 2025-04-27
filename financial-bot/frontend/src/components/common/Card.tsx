import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string | ReactNode;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}

const Card = ({
  children,
  title,
  subtitle,
  action,
  footer,
  className = '',
  noPadding = false,
  hoverable = false,
}: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm ${
        hoverable ? 'transition-shadow hover:shadow-md' : ''
      } ${className}`}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {typeof title === 'string' ? (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              ) : (
                title
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        </div>
      )}

      <div className={noPadding ? '' : 'p-6'}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200">{footer}</div>
      )}
    </div>
  );
};

// Subcomponents for specific card types
Card.Stat = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
}: {
  title: string;
  value: string | number;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`mt-2 text-sm ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </Card>
  );
};

Card.List = ({
  items,
  renderItem,
  emptyMessage = 'No items to display',
}: {
  items: any[];
  renderItem: (item: any) => ReactNode;
  emptyMessage?: string;
}) => {
  if (items.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card noPadding>
      <div className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <div key={index} className="p-6">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Card;

// Usage examples:
/*
// Basic Card
<Card
  title="Card Title"
  subtitle="Optional subtitle"
  action={<button className="btn-primary">Action</button>}
  footer={<div className="text-right">Footer content</div>}
>
  Card content goes here...
</Card>

// Stat Card
<Card.Stat
  title="Total Revenue"
  value="Rp 50,000,000"
  change="12%"
  trend="up"
  icon={<IconComponent />}
/>

// List Card
<Card.List
  items={[
    { title: 'Item 1', description: 'Description 1' },
    { title: 'Item 2', description: 'Description 2' },
  ]}
  renderItem={(item) => (
    <div>
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </div>
  )}
  emptyMessage="No items found"
/>
*/

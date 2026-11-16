import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

export const AppBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = [
    {
      title: <Link to="/app/dashboard">Home</Link>,
    },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSnippets.length - 1;
      const formattedTitle = snippet.charAt(0).toUpperCase() + snippet.slice(1).replace(/-/g, ' ');

      return {
        title: isLast ? (
          <span style={{ color: '#242033', fontWeight: 600 }}>{formattedTitle}</span>
        ) : (
          <Link to={url}>{formattedTitle}</Link>
        ),
      };
    }),
  ];

  return (
    <div style={{ marginBottom: 12 }}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

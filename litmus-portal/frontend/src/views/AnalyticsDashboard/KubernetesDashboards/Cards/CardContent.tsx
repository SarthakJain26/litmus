/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { DashboardData } from '../../../../models/dashboardsData';
import useStyles from './styles';

const CardContent: React.FC<DashboardData> = ({
  name,
  urlToIcon,
  handleClick,
  description,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <div className={classes.cardContent} onClick={handleClick}>
        <div>
          {urlToIcon ? (
            <div className={classes.cardMedia}>
              <img src={urlToIcon} alt="chart provider logo" />
            </div>
          ) : (
            <div className={classes.noImage}>Image</div>
          )}
          <div data-cy="dashboardName" className={classes.title}>
            {name}
          </div>
          {description ? (
            <div className={classes.description}>{description}</div>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
};
export default CardContent;

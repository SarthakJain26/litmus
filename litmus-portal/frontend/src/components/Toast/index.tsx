import { Snackbar, SnackbarProps } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';

interface ToastProps extends SnackbarProps {
  type: 'success' | 'error' | 'info' | 'warning';
}

const Toast: React.FC<ToastProps> = ({ type, ...rest }) => {
  const classes = useStyles();
  let classname = classes.info;
  switch (type) {
    case 'success':
      classname = classes.success;
      break;
    case 'error':
      classname = classes.error;
      break;
    case 'info':
      classname = classes.info;
      break;
    case 'warning':
      classname = classes.warning;
      break;
    default:
      classname = classes.info;
      break;
  }
  return <Snackbar className={classname} {...rest} />;
};

export default Toast;

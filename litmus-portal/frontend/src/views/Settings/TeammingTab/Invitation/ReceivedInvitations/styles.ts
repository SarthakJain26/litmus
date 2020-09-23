import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    maxHeight: '20.1875rem',
    marginBottom: theme.spacing(3),
  },
  avatarBackground: {
    backgroundColor: theme.palette.secondary.main,
    width: '2.56rem',
    height: '2.56rem',
    color: theme.palette.customColors.white(1),
    marginRight: theme.spacing(2.5),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(2.5),
    },
  },
  rowDiv: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  firstCol: {
    display: 'flex',
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(0.5),
  },
  buttonDiv: {
    display: 'flex',
  },
  snackbar: {
    bottom: '10rem',
  },
}));
export default useStyles;

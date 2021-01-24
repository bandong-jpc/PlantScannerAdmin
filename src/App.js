import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Body from "./components/Body";
import CustomAppBar from "./components/CustomAppBar";

const useStyles = makeStyles({
  root: {},
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#93a368", dark: "#485936" },
    secondary: {
      main: "#fcfbfc",
    },
  },
  typography: {
    fontFamily: ["Epilogue", "sans serif"].join(","),
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CustomAppBar />
        <Body />
      </div>
    </ThemeProvider>
  );
}

export default App;

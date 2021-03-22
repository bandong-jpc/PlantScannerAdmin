import {
    createMuiTheme,
    makeStyles,
    ThemeProvider,
} from "@material-ui/core/styles";
import { useState } from "react";
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
        warning: {
            main: "#fcfbfc",
        },
    },
    typography: {
        fontFamily: ["Epilogue", "sans serif"].join(","),
    },
});

function App() {
    const classes = useStyles();
    const [trigger, setTrigger] = useState(true);

    let fireTrigger = () => {
        setTrigger(!trigger);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CustomAppBar trigger={trigger} setTrigger={fireTrigger} />
                <Body trigger={trigger} />
            </div>
        </ThemeProvider>
    );
}

export default App;

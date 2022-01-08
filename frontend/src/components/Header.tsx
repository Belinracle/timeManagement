import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid} from "@material-ui/core";
import {Paper} from "@material-ui/core";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles({
    header: {
        width: "100%",
    }
})

const Header = () => {
    const classes = useStyles();
    let navigate = useNavigate();

    const handleLogout=()=>{
        localStorage.setItem("username","");
        navigate("/");
    }
    return (
        <Paper  elevation={3} className={classes.header}>
            <Grid container spacing={2}>
                <Grid item sm={10} md={10}>
                    Time Management App <br/>
                    P33301 Dzhukashev Daniel
                </Grid>
                <Grid item sm={2} md={2}>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={handleLogout}>Log Out</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Header
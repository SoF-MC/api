import { AppRoute } from '../types';

const route: AppRoute = {
    run: (req, res) => {
        res.send("Hello, world!")
    },
    route: '/',
    method: "GET"
}

export default route;
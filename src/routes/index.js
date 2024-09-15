import React from "react";
import { Navigate } from "react-router";

import Home from "../pages/Home/Home";

// 实际上，并没有真正意义上使用到路由
export default [
    {
        path:'/Welcome-To-GDOU-Math-Modeling',
        element:<Home/>,
    },{
        path:'/Welcome-To-GDOU-Math-Modeling@test_mode',
        element:<Home/>,
    },{
        path:'*',
        element:<Navigate to="/Welcome-To-GDOU-Math-Modeling"/>
    }
]
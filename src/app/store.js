import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import ordersReducer from "../features/orders/ordersSlice";
import companyReducer from "../features/superAdmin/companySlice";
import branchReducer from "../features/superAdmin/branchSlice";
import usersReducer from "../features/superAdmin/userSlice";
import heroReducer from "../features/website/heroSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        inventory: inventoryReducer,
        orders: ordersReducer,
        company: companyReducer,
        branch: branchReducer,
        users: usersReducer,
        hero: heroReducer,
    },
});
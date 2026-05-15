import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import ordersReducer from "../features/orders/ordersSlice";
import companyReducer from "../features/superAdmin/companySlice";
import branchReducer from "../features/superAdmin/branchSlice";
import usersReducer from "../features/superAdmin/userSlice";
import heroReducer from "../features/website/heroSlice";
import rolesReducer from "../features/add_by_admin/roleSlice";
import sidebarsReducer from "../features/add_by_admin/sidebarSlice"
import roleRightsReducer from "../features/add_by_admin/role_rights/roleRightsSlice";
import activityLogReducer from "../features/activityLog/activityLogSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        inventory: inventoryReducer,
        orders: ordersReducer,
        company: companyReducer,
        branch: branchReducer,
        users: usersReducer,
        hero: heroReducer,
        roles: rolesReducer,
        sidebars: sidebarsReducer,
        roleRights: roleRightsReducer,
        activityLogs: activityLogReducer,
    },
});
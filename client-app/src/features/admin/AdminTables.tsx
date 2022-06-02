import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import AdminIngredientsTable from "./adminTables/AdminIngredientsTable";
import AdminProfilesTable from "./adminTables/AdminProfilesTable";
import AdminRecipesTable from "./adminTables/AdminRecipesTable";

export default observer(function AdminTables() {
    const { adminStore } = useStore();

    const panes = [
        { menuItem: 'Recipes', render: () => <AdminRecipesTable /> },
        { menuItem: 'Ingredients', render: () => <AdminIngredientsTable /> },
        { menuItem: 'Profiles', render: () => <AdminProfilesTable /> },
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='left'
            panes={panes}
            onTabChange={(e, data) => adminStore.setActiveTab(data.activeIndex)}
        />
    )
})
import UserStatsGrid from "./UserStatsGrid";
import { userStats } from "../../constants/users";
import UsersTable from "./UsersTable";

const Users = () => {
  return (
    <div
      id="users"
      className="w-full max-w-screen-2xl mx-auto flex flex-col space-y-6"
    >
      <UserStatsGrid stats={userStats} />
      <UsersTable />
    </div>
  );
};

export default Users;

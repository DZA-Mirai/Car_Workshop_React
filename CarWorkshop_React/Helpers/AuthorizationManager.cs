namespace CarWorkshop_React.Helpers
{
    public static class AuthorizationManager
    {
        public static int currentUserId = -1;
        public static bool isAdmin = false;

        public static void SetCurrentUser(int userId, bool admin)
        {
            currentUserId = userId;
            isAdmin = admin;
        }
    }
}

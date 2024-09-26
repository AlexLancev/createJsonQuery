let users = [{ key: "1", name: "Aleksei Vavulo", age: 36, address: "Russia" }];

const findUserIndexByKey = (key) => users.findIndex((user) => user.key === key);

export const mockServerConfig = {
  rest: {
    baseUrl: "/api",
    configs: [
      {
        path: "/users",
        method: "get",
        routes: [
          {
            data: () => users,
          },
        ],
      },
      {
        path: "/users",
        method: "post",
        routes: [
          {
            data: (req) => {
              const newUser = req.body;
              if (!newUser || !newUser.key) {
                return { error: "Пользователь должен содержать ключ." };
              }
              users.push(newUser);
              return newUser;
            },
          },
        ],
      },
      {
        path: "/users/:key",
        method: "delete",
        routes: [
          {
            data: (req) => {
              const { key } = req.params;
              const userIndex = findUserIndexByKey(key);

              if (userIndex === -1) {
                return { error: "Пользователь не найден." };
              }

              users.splice(userIndex, 1);
              return { success: true };
            },
          },
        ],
      },
    ],
  },
};

export default mockServerConfig;

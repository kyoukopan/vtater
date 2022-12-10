import React, { createContext, useState, useContext, useMemo } from 'react';

// Empty userStore e.g. when logged out
export const defaultUserStore = {
  user: null,
  handle: null,
};

// Initialize UserContext with empty context value
const UserContext = createContext({ userStore: {}, setUserStore: () => {} });

/**
 * userStore - the userStore context, can be called from any child of WithUser
 * setUserStore - a function from the useState hook that lets you update userStore
 * @returns {{userStore: object, setUserStore: function}}
 *
 * @example
 * ```jsx
 * const { userStore, setUserStore } = useUserStore;
 * ```
 */
export const useUserStore = () => useContext(UserContext);

/**
 * The UserContext provider containing userStore's state. All of its children are able to access userStore
 * like so:
 *
 * ```jsx
 * const {userStore} = useUserStore
 * ```
 * @param {React.ReactNode} props.children
 * @returns
 */
function WithUserStore({ children }) {
  const [userStore, setUserStore] = useState(defaultUserStore);
  const userStoreMemo = useMemo(
    () => ({
      userStore,
      setUserStore,
    }),
    [userStore]
  );

  return (
    <UserContext.Provider value={userStoreMemo}>
      {children}
    </UserContext.Provider>
  );
}

export default WithUserStore;

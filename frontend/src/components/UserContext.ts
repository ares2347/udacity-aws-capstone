import React from 'react'

const UserContext = React.createContext({} as any)

export const UserProvider = UserContext.Provider
export const UserConsumer = UserContext.Consumer

export default UserContext
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type UserRole = 'consumidor' | 'productor' | 'administrador'

type UiState = {
  activeRole: UserRole
}

const initialState: UiState = {
  activeRole: 'consumidor',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveRole(state, action: PayloadAction<UserRole>) {
      state.activeRole = action.payload
    },
  },
})

export const { setActiveRole } = uiSlice.actions
export default uiSlice.reducer

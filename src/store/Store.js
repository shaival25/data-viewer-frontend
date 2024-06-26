import { combineReducers, configureStore } from '@reduxjs/toolkit';
import NotesReducer from './apps/notes/NotesSlice';
import CustomizerReducer from './customizer/CustomizerSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import ContactsReducer from './apps/contacts/ContactSlice';
import EmailReducer from './apps/email/EmailSlice';
import TicketReducer from './apps/ticket/TicketSlice';
import AuthReducer from './apps/auth/AuthSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistConfig = { key: 'root', version: 1, storage };

const reducer = combineReducers({
  auth: AuthReducer,
  customizer: CustomizerReducer,
  notesReducer: NotesReducer,
  chatReducer: ChatsReducer,
  contactsReducer: ContactsReducer,
  emailReducer: EmailReducer,
  ticketReducer: TicketReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export default store;

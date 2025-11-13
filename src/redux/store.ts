import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import {baseApi} from './baseApi';
import languageReducer from './features/language/languageSlice';
// Create a noop storage for non-browser environments
const createNoopStorage = () => {
	return {
		getItem(_key: any) {
			return Promise.resolve(null);
		},
		setItem(_key: any, value: any) {
			return Promise.resolve(value);
		},
		removeItem(_key: any) {
			return Promise.resolve();
		},
	};
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// Combine all reducers
const rootReducer = combineReducers({
	user: userSlice,
	language: languageReducer,
	[baseApi.reducerPath]: baseApi.reducer,
});

// Persist configuration
const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['wishlistJobs', 'user', 'language'], // Only persist these slices
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(baseApi.middleware), // Add API middleware
});

// Explicitly type RootState for correct middleware inference
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

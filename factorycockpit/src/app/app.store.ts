import { computed, Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthService} from './shared/services/auth.service';

export interface User {
    userId: string;
    username: string;
    joined: string;
}

type AppState = { };

const initialState: AppState = { };

export const AppStore = signalStore(
    { providedIn: "root" },
    withState(initialState),
    withComputed((store, authService = inject(AuthService)) => ({
        user: computed(() => authService.user()),
    })),
    withMethods((store, router = inject(Router), authService = inject(AuthService)) => ({
        login: async (email: string, password: string) => {  
            await authService.login(email, password);
            router.navigate(["/dashboard"]);
            
        },
        logout: async ()=> {
            await authService.logout(store.user()?.userId);
            //patchState(store, { user: undefined });
            router.navigate(["/login"]);
        }
    }))
);
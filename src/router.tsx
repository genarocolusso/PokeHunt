// src/router.tsx
import { createBrowserRouter } from "react-router";
import App from "./App"; // your main layout
import { LoginPage } from "./login";
import { NotFoundPage } from "./NotFoundPage";
import PokemonHunt from "./pokemonHunt/pokemonHunt";
import { HuntCollection } from "./HuntCollection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout or main wrapper
    children: [
      { index: true, element: <PokemonHunt /> },
      { path: "/hunt-collection", element: <HuntCollection /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

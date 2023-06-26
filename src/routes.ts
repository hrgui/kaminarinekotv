import Router from "@lightningjs/sdk/src/Router";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ContentDetails from "./pages/ContentDetails";
import { getContentGroup } from "./api-client";

const routes: Router.Config = {
  root: "splash",
  routes: [
    {
      path: "splash",
      component: Splash as any,
    },
    {
      path: "home",
      component: Home as any,
    },
    {
      path: "content/:id",
      component: ContentDetails as any,
      on: async (page, { id }) => {
        console.log("on", id, page);
        if (id) {
          (page as any).data = await getContentGroup(+id);
        }
      },
    },
    {
      path: "*",
      component: NotFound as any,
    },
  ],
};

export default routes;

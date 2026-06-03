import layout from "@/layout/index.vue";
import Chat from "@/views/Chat/index.vue";

export default [
  {
    path: "/",
    component: layout,
    children: [{ path: "/chat/index", component: Chat }],
  },
];

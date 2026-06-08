import layout from "@/layout/index.vue";
import Course from "@/views/Course/index.vue";

export default [
  {
    path: "/",
    component: layout,
    children: [{ path: "/courses/index", component: Course }],
  },
];

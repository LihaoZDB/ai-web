<template>
  <div
    class="relative w-[800px] h-full bg-linear-to-br from-gray-800 to-gray-900"
  >
    <canvas class="w-full h-full" ref="canvasRef"></canvas>
    <div class="absolute top-6 left-6">
      <div class="flex items-center gap-2">
        <div
          class="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-[10px] flex items-center justify-center"
        >
          <span class="text-white font-bold text-xl">E</span>
        </div>
        <span class="text-white text-xl font-bold">English App</span>
      </div>
    </div>
    <!-- 登录/注册切换按钮 -->
    <div class="absolute top-6 right-6">
      <div
        class="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1"
      >
        <button :class="loginClass" @click="loadModel('login')">登录</button>
        <button :class="registerClass" @click="loadModel('register')">
          注册
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; //gltf模型加载器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; //轨道控制器
import type { LOGIN_TYPE } from "./type.ts";
const type = ref<LOGIN_TYPE>("login");
const loginClass = computed(() => {
  return type.value === "login"
    ? "bg-indigo-500 text-white shadow-lg px-4 py-2 rounded-md text-sm font-medium transition-all"
    : "text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-all";
});
const registerClass = computed(() => {
  return type.value === "register"
    ? "bg-indigo-500 text-white shadow-lg px-4 py-2 rounded-md text-sm font-medium transition-all"
    : "text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-all";
});

const emits = defineEmits(["changeType"]);

const canvasRef = useTemplateRef("canvasRef");

const scene = new THREE.Scene(); //创建场景
const clock = new THREE.Timer(); //创建时钟
let currentModel: THREE.Group | null = null; // 记录当前选择的模型
let mixer: THREE.AnimationMixer | null = null; // 记录当前动画混合器
const loadModel = (url: LOGIN_TYPE) => {
  // 移除模型
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }
  // 加载新模型
  const loader = new GLTFLoader();
  type.value = url;
  if (url === "login") {
    loader.load("/models/login/scene.gltf", (gltf) => {
      currentModel = gltf.scene;
      scene.add(currentModel);
      scene.position.y = -0.8;
      currentModel.scale.set(0.8, 0.8, 0.8); // 设置模型缩放
    });
  }
  if (url === "register") {
    loader.load("/models/register/scene.gltf", (gltf) => {
      currentModel = gltf.scene;
      scene.add(currentModel);
      scene.position.y = -0.8;
      currentModel.scale.set(0.8, 0.8, 0.8); // 设置模型缩放
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentModel);
        gltf.animations.forEach((animation) => {
          const action = mixer!.clipAction(animation);
          action.play();
        });
      }
    });
  }
  emits("changeType", url); // 通知父组件切换类型
};

const initThree = () => {
  const width = canvasRef.value!.clientWidth;
  const height = canvasRef.value!.clientHeight;
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000); //创建相机
  camera.position.set(1, 0.5, 1); // 设置相机位置
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value!, //渲染容器
    antialias: true, //抗锯齿
    alpha: true, //透明度
    precision: "highp", //高精度
    powerPreference: "high-performance", //高性能
  });
  loadModel(type.value); // 加载登录模型
  renderer.setSize(width, height); //设置渲染器大小
  renderer.render(scene, camera); //渲染场景
  const controls = new OrbitControls(camera, renderer.domElement); // 创建轨道控制器
  const animate = () => {
    requestAnimationFrame(animate); // 请求下一帧动画
    if (mixer) {
      mixer.update(clock.getDelta());
    }
    scene.rotation.y += 0.02; // 旋转场景
    controls.update(); // 更新轨道控制器
    renderer.render(scene, camera); // 渲染场景
  };
  animate();
};

onMounted(() => {
  initThree();
});
</script>

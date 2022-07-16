import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [{
    path: '/offline/:name', name: 'Offline', component: () => import('../views/Offline.vue')
}, {
    path: '/charselector', name: 'CharSelector', component: () => import('../views/CharSelector.vue')
}, {
    path: '/charcreator', name: 'CharCreator', component: () => import('../views/CharCreator.vue')
}, {
    path: '/game', name: 'Game', component: () => import('../views/Game.vue')
}, {
    path: '/adminprison', name: 'AdminPrison', component: () => import('../views/AdminPrison.vue')
}, {
    path: '/hairsalon', name: 'HairSalon', component: () => import('../views/HairSalon.vue')
}, {
    path: '/tattoostudio', name: 'TattooStudio', component: () => import('../views/TattooStudio.vue')
}, {
    path: '/clothingstore', name: 'ClothingStore', component: () => import('../views/ClothingStore.vue')
}, {
    path: '/prison', name: 'Prison', component: () => import('../views/Prison.vue')
}, {
    path: '/vehicleservice', name: 'VehicleService', component: () => import('../views/VehicleService.vue')
}]

const router = createRouter({
    history: createWebHashHistory('configure-admin'), routes
})

export default router

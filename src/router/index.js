import Vue from 'vue'
import Router from 'vue-router'
import CallLogs from '@/components/CallLogs'
import PopUp from '@/components/PopUp'
import DriverInfo from '@/components/DriverInfo'
import OperatorCalls from '../components/OperatorCalls'
import WorkersStatus from '@/components/WorkersStatus'
Vue.use(Router);

/* Code For routing  */
export default new Router({
  routes: [
	{
		path: '/',
		redirect: 'callLogs'
	},
	{
		path: '/callLogs',
		name: 'CallLogs',
		component: CallLogs,
    	props:true
	},
	{
		path: '/popUp',
		name: 'PopUp',
		component: PopUp
	},
	{
		path: '/dashboard',
		name: 'DriverInfo',
		component: DriverInfo,
    	props:true
	},
    {
		path: '/operatorCalls',
		name: 'OperatorCalls',
		component: OperatorCalls
    },
	{
		path: '/workersStatus',
		name: 'WorkersStatus',
		component: WorkersStatus
	}
  ],
	mode: 'history',
	linkActiveClass: "active",
  	linkExactActiveClass: "exact-active",
})

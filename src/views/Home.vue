<template>
    <div class="">
        <!-- Delete Task Popup Start -->
        <div v-if="deleteTaskFlag" class="">
            <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
                <div class="rounded-lg shadow-md w-80 divide-y divide-solid">
                    <div class="bg-purple-900 rounded-t-lg">
                        <h2 class="p-4 text-xl text-white font-medium" align="left">Delete Task</h2>
                    </div>
                    
                    <div class="p-4 bg-white rounded-b-lg">
                        <!-- Form -->
                        <p class="pb-2 text-lg text-purple-900" align="left">Are you sure you want to delete the task?</p>
                        
                        <div class="flex justify-end align-center">
                            <button class="text-purple-900 px-4 py-2 w-24 font-bold rounded" @click="discardDeleteTask()"><span class="">Cancel</span></button>
                            <button class="bg-red-400 text-white px-4 py-2 w-24 font-bold rounded" @click="deleteTask()"><span class="">Delete</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Delete Task Popup End -->

        <!-- Filter Popup Start -->
        <div v-if="filterPopupFlag">
            <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
                <div class="bg-white rounded-lg shadow-md w-80 divide-y divide-solid">
                    <div class="rounded-t-lg bg-purple-900 flex justify-between align-center">
                        <h2 class="p-4 text-xl text-white font-bold" align="left">Filters</h2>

                        <button @click="filterPopupClose(filterValue)">
                            <img class="h-8 w-8 mx-6 self-center" src="../assets/close_icon.svg">
                        </button>
                    </div>
                    
                    <div class="p-4 flex flex-col align-center divide-y divide-solid">
                        <div v-for="filterItem, index in filterItems" :key="index" class="p-2 first:pt-0 last:pb-0 flex justify-between align-center" @click="filterPopupClose(filterItem)">
                            <p class="text-lg text-purple-900 font-medium" align="left">{{ filterItem }}</p>

                            <img class="h-8 w-8" v-if="filterValue == filterItem" src="../assets/selected_icon.svg" alt="Selected">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Filter Popup End -->

        <!-- Header -->
        <div class="px-4 h-16 bg-purple-100 flex justify-between items-center">
            <div class="text-xl font-bold text-purple-900">Welcome, {{ name }}!</div>

            <button class="h-9 w-9 p-2 rounded bg-purple-900" @click="filterPopupFlag=true;">
                <img src="../assets/filter_icon.svg">
            </button>
        </div>

        <div class="pb-8">
            <!-- List of ToDos -->
            <div class="mx-6 my-8 rounded-lg">
                <!-- Filter Type -->
                <div class="pb-8">
                    <p class="text-xl text-purple-900 font-bold" align="left">{{ filterValue }}</p>
                </div>

                <div v-if="addTaskFlag" class="mb-4 h-fit rounded-lg ring-2 ring-purple-400">
                    <div class="h-full p-4 divide-y divide-purple-900">
                        <div class="pb-4">
                            <form id="add-task-form" action="#" @submit="validateForm()">
                                <div class="pb-4 flex align-center">
                                    <!-- <div class="flex align-center">
                                        <button class="h-8 w-8 self-center" v-if="newTask.task_status == 'COMPLETED'" @click="toggleCompleteStatus('new')">
                                            <img src="../assets/checked_checkbox_icon.svg">
                                        </button>
                                        <button class="h-8 w-8 self-center" v-else @click="toggleCompleteStatus('new')">
                                            <img src="../assets/unchecked_checkbox_icon.svg">
                                        </button>
                                    </div> -->
                                    
                                    <input
                                        required
                                        required:border-red-500
                                        invalid:border-red-500
                                        invalid:text-red-600
                                        maxlength="50"
                                        :class="[newTask.task_status == 'COMPLETED' ? 'line-through' : '']"
                                        class="appearance-none w-full py-2 px-3 bg-purple-100 text-lg text-purple-900 rounded leading-tight focus:outline-none focus:shadow-outline"
                                        id="task" type="text" placeholder="Enter task"
                                        v-model="newTask.task_message"
                                    >
                                </div>

                                <div class="flex align-center">
                                    <!-- <img class="h-8 w-8 self-center" src="../assets/due_date_icon.svg"> -->

                                    <input
                                        required
                                        required:border-red-500
                                        invalid:border-red-500
                                        invalid:text-red-600
                                        class="appearance-none w-full py-2 px-3 text-lg bg-purple-100 text-purple-900 rounded leading-tight focus:outline-none focus:shadow-outline"
                                        id="due-date" type="text" placeholder="Enter due date"
                                        onfocus="(type='date')"
                                        v-model="newTask.due_date"
                                    >
                                </div>
                            </form>
                        </div>
                        
                        <div class="pt-4 flex justify-end">
                            <button class="text-purple-900 font-bold px-4 py-2 min-w-[100px] rounded" @click="discardTask('new')">Discard</button>
                            <input class="bg-purple-900 text-white font-bold px-4 py-2 min-w-[100px] rounded" form="add-task-form" type="submit" value="Add">
                        </div>
                    </div>
                </div>

                <div class="" v-if="tasksToDisplay && tasksToDisplay.length > 0">
                    <div v-for="task, index in tasksToDisplay" :key="index"
                        class="my-4 first:mt-0 last:mb-0 h-fit rounded-lg ring-2"
                        :class="[task.task_status == 'OVERTIME_PENDING' ? 'ring-red-400' : task.task_status == 'COMPLETED' ? 'ring-green-400' : 'ring-purple-400']"
                    >
                        <div v-if="editTaskIndex != task.id" class="h-full p-4 divide-y divide-purple-900">
                            <div class="flex justify-between">
                                <div class="flex align-center">
                                    <div class="flex align-center">
                                        <button class="h-8 w-8" v-if="task.task_status == 'COMPLETED'" @click="toggleCompleteStatus('existing', task.id)">
                                            <img src="../assets/checked_checkbox_icon.svg">
                                        </button>
                                        <button class="h-8 w-8" v-else @click="toggleCompleteStatus('existing', task.id)">
                                            <img src="../assets/unchecked_checkbox_icon.svg">
                                        </button>
                                    </div>

                                    <div class="flex flex-col align-center">
                                        <p :class="[task.task_status == 'COMPLETED' ? 'line-through' : '']" class="mx-4 pb-2 break-all grow-0 shrink-1 text-xl text-purple-900 rounded" align="left">{{ task.task_message }}</p>

                                        <div v-if="task.due_date" class="ml-4 grow-1 shrink-0 flex align-center">
                                            <img class="h-5 w-5 self-center" src="../assets/due_date_icon.svg">
                                            <!-- <p class="self-center text-lg text-purple-900 font-bold" align="left">Due by:</p> -->

                                            <p class="self-center ml-2 text-sm text-purple-900" align="left">{{ task.due_date }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="grow-0 shrink-0 self-center">
                                    <div class="relative inline-block text-left">
                                        <div>
                                            <button
                                                type="button"
                                                class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-sm font-semibold text-gray-900"
                                                id="menu-button" aria-expanded="true" aria-haspopup="true"
                                                @click="toggleActionsPopup(task.id)"
                                            >
                                            <img class="h-8 w-8" src="../assets/todo_actions_menu_icon.svg">
                                            </button>
                                        </div>

                                        <div v-if="showActionsFlag && task.id == showActionsIndex" class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-purple-900 ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                            <div class="px-4 py-2 divide-y divide-solid" role="none">
                                            <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->

                                                <div class="pb-2 w-full">
                                                    <button class="flex align-center" @click="editTaskOpen(task.id)">
                                                        <img class="h-9 w-9 bg-purple-900 p-2 rounded" src="../assets/edit_icon.svg">
                                                        <p class="text-purple-900 block ml-4 text-lg" tabindex="-1" id="menu-item-0">Edit</p>
                                                    </button>
                                                </div>

                                                <div class="py-2 w-full">
                                                    <button class="flex align-center" @click="deleteTaskPopup(task.id)">
                                                        <img class="h-9 w-9 bg-purple-900 p-2 rounded" src="../assets/delete_icon.svg">
                                                        <p class="text-purple-900 block ml-4 text-lg" tabindex="-1" id="menu-item-1">Delete</p>
                                                    </button>
                                                </div>

                                                <div class="pt-2 w-full">
                                                    <button class="flex align-center" @click="duplicateTaskOpen(task.id)">
                                                        <img class="h-9 w-9 bg-purple-900 p-2 rounded" src="../assets/duplicate_icon.svg">
                                                        <p class="text-purple-900 block ml-4 text-lg" tabindex="-1" id="menu-item-2">Duplicate</p>
                                                    </button>
                                                </div>
                                            
                                            
                                            
                                            <!-- <form method="POST" action="#" role="none">
                                                <button type="submit" class="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Sign out</button>
                                            </form> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="h-full p-4 divide-y divide-purple-900">
                            <div class="pb-4">
                                <form id="edit-form-id" @submit="editTask()">
                                    <div class="pb-4 flex align-center">
                                        <div class="flex align-center">
                                            <button class="h-8 w-8 self-center" v-if="editTaskData.task_status == 'COMPLETED'" @click="toggleCompleteStatus('edit')">
                                                <img src="../assets/checked_checkbox_icon.svg">
                                            </button>
                                            <button class="h-8 w-8 self-center" v-else @click="toggleCompleteStatus('edit')">
                                                <img src="../assets/unchecked_checkbox_icon.svg">
                                            </button>
                                        </div>
                                        
                                        <input
                                            required
                                            required:border-red-500
                                            invalid:border-red-500
                                            invalid:text-red-600
                                            maxlength="30"
                                            :class="[editTaskData.task_status == 'COMPLETED' ? 'line-through' : '']"
                                            class="appearance-none w-full ml-4 py-2 px-3 bg-purple-100 text-lg text-purple-900 rounded border border-purple-900 leading-tight focus:outline-none focus:shadow-outline"
                                            id="task" type="text" placeholder="Enter task"
                                            v-model="editTaskData.task_message"
                                        >
                                    </div>

                                    <div class="flex align-center">
                                        <img class="h-8 w-8 self-center" src="../assets/due_date_icon.svg">

                                        <input
                                            required
                                            required:border-red-500
                                            invalid:border-red-500
                                            invalid:text-red-600
                                            class="appearance-none w-full ml-4 py-2 px-3 bg-purple-100 text-lg text-purple-900 rounded border border-purple-900 leading-tight focus:outline-none focus:shadow-outline"
                                            id="due-date" type="date" placeholder="Enter due date (YYYY-MM-DD)"
                                            v-model="editTaskData.due_date"
                                            @change="onDueDateUpdate(editTaskIndex)"
                                        >
                                    </div>
                                </form>
                            </div>
                            
                            <div class="pt-4 flex justify-end">
                                <button class="text-purple-900 font-bold px-4 py-2 min-w-[100px] rounded" @click="discardTask('edit')">Discard</button>
                                <input class="bg-purple-900 font-bold text-white px-4 py-2 min-w-[100px] rounded" form="edit-form-id" type="submit" value="Save">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="!addTaskFlag" class="pt-4">
                        <div v-if="filterValue == 'All Tasks'">
                            <img class="pb-4 h-20 w-20 inline" src="../assets/no_tasks_icon.svg">
                            <p  class="text-xl text-purple-900 font-medium">Uh oh, No tasks yet.</p>
                        </div>
                        <div v-else-if="filterValue == 'Pending Tasks'">
                            <img class="pb-4 h-20 w-20 inline" src="../assets/green_success_icon.svg">
                            <p class="text-xl text-purple-900 font-medium">Hurray! No pending tasks.</p>
                        </div>
                        <div v-if="filterValue == 'Completed Tasks'">
                            <img class="pb-4 h-20 w-20 inline" src="../assets/no_tasks_icon.svg">
                            <p class="text-xl text-purple-900 font-medium">Uh oh! No tasks found.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Add Icon -->
            <!-- class="sm:hidden px-4 py-4 ring-2 ring-purple-400 fixed bottom-8 right-8 rounded-full bg-purple-100 shadow-xl" @click="addTaskPopupOpen()" -->
            <button
            class="fixed bottom-8 right-8 rounded-full" @click="addTaskPopupOpen()"
            >
                <img class="h-16 w-16" src="../assets/add_fill_icon.svg">
            </button>
        </div>
    </div>
</template>

<script>
function validateForm() {
    this.addTask();

    return true;
}

export default {
    name: 'Home',
    components: {
        
    },
    data() {
        return {
            name: 'Vinu',
            taskList: [],
            showActionsIndex: null,
            showActionsFlag: false,
            newTask: {},
            addTaskFlag: false,
            editTaskData: {},
            editTaskIndex: null,
            editTaskFlag: false,
            deleteTaskIndex: null,
            deleteTaskFlag: false,
            filterPopupFlag: false,
            filterItems: [
                'All Tasks',
                'Pending Tasks',
                'Completed Tasks'
            ],
            filterValue: 'All Tasks',
            tasksToDisplay: null,
            nextIndex: null,
        }
    },
    watch: {
        taskList() {
            console.log('console.log', this.taskList);
            console.log('this.filterValue: ', this.filterValue);
            if (this.filterValue == 'All Tasks') {
                console.log('spy 1');
                this.tasksToDisplay = this.taskList;
            } else if (this.filterValue == 'Pending Tasks') {
                console.log('spy 2');
                this.tasksToDisplay = this.taskList.length > 0 ? this.taskList.filter((taskItem) => taskItem.task_status != 'COMPLETED') : [];
            } else if (this.filterValue == 'Completed Tasks') {
                console.log('spy 3');
                this.tasksToDisplay = this.taskList.length > 0 ? this.taskList.filter((taskItem) => taskItem.task_status == 'COMPLETED') : [];
            }
        },
        filterValue() {
            if (this.filterValue == 'All Tasks') {
                console.log('spy 1');
                this.tasksToDisplay = this.taskList;
            } else if (this.filterValue == 'Pending Tasks') {
                console.log('spy 2');
                this.tasksToDisplay = this.taskList.length > 0 ? this.taskList.filter((taskItem) => taskItem.task_status != 'COMPLETED') : [];
            } else if (this.filterValue == 'Completed Tasks') {
                console.log('spy 3');
                this.tasksToDisplay = this.taskList.length > 0 ? this.taskList.filter((taskItem) => taskItem.task_status == 'COMPLETED') : [];
            }
        }
    },
    mounted() {
        // Get the name.
        this.$store.dispatch("changeName", this.name);

        // Fetch Index.
        this.nextIndex = this.$store.state.index ? this.$store.state.index : 1;

        // Fetch data from Vuex.
        this.taskList = this.$store.state.task_list ? this.$store.state.task_list : [];
        this.tasksToDisplay = this.taskList;
    },
    methods: {
        validateForm() {
            this.addTask();

            return true;
        },
        toggleActionsPopup(taskIndex) {
            this.showActionsIndex = this.showActionsIndex != null && this.showActionsIndex >= 0 ? null : taskIndex;
            this.showActionsFlag = !this.showActionsFlag;
        },
        onDueDateUpdate() {
            this.editTaskData = { ...this.editTaskData, task_status: this.editTaskData.task_status != 'COMPLETED' ? this.editTaskData.due_date && new Date(this.editTaskData.due_date).getTime() < Date.now() ? 'OVERTIME_PENDING' : 'PENDING' : 'COMPLETED' };
        },
        addTaskPopupOpen() {
            this.newTask = {
                task_message: '',
                task_status: 'PENDING',
                due_date: null,
                createdAt: null
            };

            this.addTaskFlag = true;
        },
        addTask() {
            this.taskList.push({
                ...this.newTask,
                id: this.nextIndex,
                // task_status: (this.newTask.due_date && new Date(this.newTask.due_date).getTime() < Date.now() ? 'OVERTIME_PENDING' : 'PENDING'),
                task_status: (this.newTask.task_status != 'COMPLETED' ? this.newTask.due_date && new Date(this.newTask.due_date).getTime() < Date.now() ? 'OVERTIME_PENDING' : 'PENDING' : 'COMPLETED'),
                createdAt: Date.now()
            });
            
            this.nextIndex++;

            this.$store.dispatch("changeIndex", this.nextIndex);
            this.$store.dispatch("changeTaskList", this.taskList);
            this.addTaskFlag = false;

            return false;
        },
        discardTask(actionType) {
            if (actionType == 'new') {
                this.newTask = {};
                this.addTaskFlag = false;
            } else if (actionType == 'edit') {
                this.editTaskData = {};
                this.editTaskIndex = null;
                this.editTaskFlag = false;
            }
        },
        editTaskOpen(taskIndex) {
            this.editTaskIndex = taskIndex;

            let indexValue = this.taskList.findIndex((task) => this.editTaskIndex == task.id);
            this.editTaskData = Object.assign({}, this.taskList[indexValue]);

            this.showActionsIndex = null;
            this.showActionsFlag = false;
            this.editTaskFlag = true;
        },
        editTask() {
            let indexValue = this.taskList.findIndex((task) => this.editTaskIndex == task.id);
            console.log('this.editTaskData: ', this.editTaskData);
            this.taskList[indexValue] = Object.assign({}, this.editTaskData);

            // Update Local Storage.
            this.$store.dispatch("changeTaskList", this.taskList);
            // localStorage.setItem('task_list', JSON.stringify(this.taskList));

            this.editTaskData = {};
            this.editTaskIndex = null;
            this.editTaskFlag = false;
        },
        deleteTaskPopup(taskIndex) {
            this.deleteTaskIndex = taskIndex;

            this.showActionsIndex = null;
            this.showActionsFlag = false;
            this.deleteTaskFlag = true;
        },
        deleteTask() {
            let indexValue = this.taskList.findIndex((task) => this.deleteTaskIndex == task.id);
            this.taskList.splice(indexValue, 1);

            // Update Local Storage.
            // localStorage.setItem('task_list', JSON.stringify(this.taskList));
            this.$store.dispatch("changeTaskList", this.taskList);

            this.deleteTaskIndex = null;
            this.deleteTaskFlag = false;
        },
        discardDeleteTask() {
            this.deleteTaskIndex = null;
            this.deleteTaskFlag = false;
        },
        duplicateTaskOpen(taskIndex) {
            let indexValue = this.taskList.findIndex((task) => taskIndex == task.id);
            this.newTask = {
                ...this.taskList[indexValue],
                task_status: 'PENDING',
                createdAt: null
            };

            console.log('this.newTask: ', this.newTask);
            this.showActionsIndex = null;
            this.showActionsFlag = false;
            this.addTaskFlag = true;
        },
        toggleCompleteStatus(taskType, taskIndex) {
            if (taskType == 'new') {
                this.newTask.task_status = this.newTask.task_status == 'COMPLETED' ? this.newTask.due_date && new Date(this.newTask.due_date).getTime() < Date.now() ? 'OVERTIME_PENDING' : 'PENDING' : 'COMPLETED';
            } else if (taskType == 'edit') {
                console.log('edit toggle');
                this.editTaskData.task_status = this.editTaskData.task_status == 'COMPLETED' ? this.editTaskData.due_date && new Date(this.editTaskData.due_date).getTime() < Date.now() ? 'OVERTIME_PENDING' : 'PENDING' : 'COMPLETED';
                console.log('this.editTaskData.task_status: ', this.editTaskData.task_status);
            } else {
                console.log('called');
                let indexValue = this.taskList.findIndex((task) => taskIndex == task.id);
                this.taskList[indexValue].task_status = this.taskList[indexValue].task_status == 'COMPLETED' ? this.taskList[indexValue].due_date && new Date(this.taskList[indexValue].due_date).getTime() < Date.now() ? 'OVERTIME_PENDING' : 'PENDING' : 'COMPLETED';
                console.log('this.taskList[indexValue].task_status: ', this.taskList[indexValue].task_status);
            }

            // Update Local Storage.
            // localStorage.setItem('task_list', JSON.stringify(this.taskList));
            this.$store.dispatch("changeTaskList", this.taskList);
        },
        filterPopupClose(filterItemValue) {
            this.filterValue = filterItemValue;

            if (this.filterValue == 'All Tasks') {
                this.tasksToDisplay = this.taskList;
            } else if (this.filterValue == 'Pending Tasks') {
                this.tasksToDisplay = this.taskList.length > 0 ? this.taskList.filter((taskItem) => taskItem.task_status != 'COMPLETED') : [];
            } else if (this.filterValue == 'Completed Tasks') {
                this.tasksToDisplay = this.taskList.length > 0 ? this.taskList.filter((taskItem) => taskItem.task_status == 'COMPLETED') : [];
            }

            this.filterPopupFlag = false;
        }
        
    }
}
</script>

<style scoped>

</style>
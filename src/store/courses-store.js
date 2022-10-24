import { api } from "../config/apiConfig";
import { writable } from "svelte/store";
import Cookies from "js-cookie";


const courses = writable([]);

async function getCourses() {
    await api.setHeader("Authorization", `Bearer ${Cookies.get("userToken")}`);
    const response = await api.get("/api/courses?page=1");
    if (response.problem) {
        return response.data.code
    } else {
        return courses.set(response.data);
    }
}

async function addCourse(courseData) {
    await api.setHeader("Authorization", `Bearer ${Cookies.get("userToken")}`);
    const response = await api.post("/api/add-courses", courseData);
    if (response.problem) {
        return response.data.code
    } else {
        courses.update((courses) => {
            return [...courses, courseData];
        });
        return true
    }
}

async function editCourse(courseId, data) {
    await api.setHeader("Authorization", `Bearer ${Cookies.get("userToken")}`);
    const response = await api.post(`/api/update-courses/${courseId}`, data);
    if (response.problem) {
        return response.data
    } else {
        courses.update((courses) => {
            const selectedCourse = courses.findIndex(
                (course) => course.guid === courseId
            );
            const updatedCourse = { ...courses[selectedCourse], ...data };
            const updatedCourses = [...courses];
            updatedCourses[selectedCourse] = updatedCourse;
            console.log('updatedCourses : ', updatedCourses)
            return updatedCourses;
        });
    }
}

async function subscribeCourse(guid) {
    await api.setHeader("Authorization", `Bearer ${Cookies.get("userToken")}`);
    const response = await api.post("/api/subscribe", {
        course_uuid: guid,
    });
    if (response.problem) {
        return response.data.code
    } else {
        courses.update((courses) => {
            const selectedCourse = courses.findIndex(
                (course) => course.guid === guid
            );
            const updatedCourse = { ...courses[selectedCourse] };
            const updatedCourses = [...courses];
            updatedCourse.subscriber_count = updatedCourse.subscriber_count + 1;
            updatedCourses[selectedCourse] = updatedCourse;
            return updatedCourses;
        });
    }
}

// create unsubscribe
async function unSubscribeCourse(guid) {
    await api.setHeader("Authorization", `Bearer ${Cookies.get("userToken")}`);
    const response = await api.post("/api/unsubscribe", {
        course_uuid: guid,
    });
    if (response.problem) {
        return response.data.code
    } else {
        courses.update((courses) => {
            const selectedCourse = courses.findIndex(
                (course) => course.guid === guid
            );
            const updatedCourse = { ...courses[selectedCourse] };
            const updatedCourses = [...courses];
            updatedCourse.subscriber_count = updatedCourse.subscriber_count - 1;
            updatedCourses[selectedCourse] = updatedCourse;
            return updatedCourses;
        });
    }
}

async function getCourseSubscriptions(guid) {
    await api.setHeader("Authorization", `Bearer ${Cookies.get("userToken")}`);
    const response = await api.get(`/api/subscriptions/${guid}`);
    if (response.problem) {
        return response.data.code
    } else {
        return response.data
    }
}

const customCoursesStore = {
    subscribe: courses.subscribe,
    getCourses,
    addCourse,
    editCourse,
    subscribeCourse,
    unSubscribeCourse,
    getCourseSubscriptions
};

export default customCoursesStore;
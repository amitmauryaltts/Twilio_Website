<template>
    <div>
        <v-card
            id="infoWindow"
            flat
        >
            <v-card-title class="sourceSansProSemiBold" id="infoWindowTitle">Driver Info</v-card-title>
            <v-card-text>
                <p v-if="fullName">
                    <span class="sourceSansProSemiBold ">Full Name : </span> {{fullName}}
                </p>
                <p v-if="licensePlateNumber">
                    <span class="sourceSansProSemiBold ">License Plate Number :</span>: {{licensePlateNumber}}
                </p>
                <p v-if="jobType">
                    <span class="sourceSansProSemiBold ">Job Type :</span> {{jobType}}
                </p>
                <p v-if="jobStatus">
                    <span class="sourceSansProSemiBold ">Job Status :</span> {{jobStatus}}
                </p>
            </v-card-text>

            <v-card-actions>
                <v-btn
                    flat
                    small
                    @click="isVisible=true"
                >Track</v-btn>
            </v-card-actions>
        </v-card>

        <trackerwindow
            :visible="isVisible"
            @dialog-listener="dialogVisible"
            :content="content"
        ></trackerwindow>

    </div>
</template>

<script>
import trackerwindow from "../DriverInfo";

export default {
    name: "infowindow",
    components: {
        trackerwindow
    },
    props: ["content"],
    data() {
        return {
            isVisible: false,
            fullName: null,
            licensePlateNumber: null,
            jobType: null,
            jobStatus: null
        };
    },
    methods: {
        dialogVisible(value) {
            this.visible = false;
            this.isVisible = value;
        }
    },
    mounted() {
        if (this.content.driver.firstName || this.content.driver.lastName) {
            this.fullName =
                this.content.driver.firstName +
                " " +
                this.content.driver.lastName;
        }
        if (this.content.car.licensePlateNumber) {
            this.licensePlateNumber = this.content.car.licensePlateNumber;
        }
        if (this.content.job.job_type) {
            this.jobType = this.content.job.job_type;
        }
        if (this.content.job.job_status) {
            this.jobStatus = this.content.job.job_status;
        }
    }
};
</script>
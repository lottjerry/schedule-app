<template>
  <div>
    <v-container>
      <v-row class="justify-center pa-10">
        <h1 class="text-primary">Schedules</h1>
      </v-row>
      <v-row class="justify-center pa-10">
        <v-col cols="2">
          <v-select
            color="primary"
            label="Select"
            :items="schedules"
            v-model="selectedSchedule" 
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        {{ selectedSchedule }}
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

let schedules = ref([]);
let selectedSchedule = ref(null); // To store the selected value

const fetchSchedules = async () => {
  const querySnap = await getDocs(query(collection(db, 'Schedules')));
  
  // Clear the schedules array before populating it
  schedules.value = [];

  // Add each doc's "name" field to the schedules array
  querySnap.forEach((doc) => {
    schedules.value.push(doc.id);
  });
};

onMounted(() => {
  fetchSchedules();
  console.log(schedules);
});
</script>

<style lang="scss" scoped></style>

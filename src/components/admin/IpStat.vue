<template>
    <div class="ip-stat">
        <div class="ip-stat__select-period">
            <DateTimePicker
                v-model="selectedPeriod"
                format="yyyy-LLLL"
                min-date="2019-12-01"
                :max-date="new Date()"
                :auto-close="true"
                @close="updateAdminVisitsData"
            >
            </DateTimePicker>
        </div>
        <BarChart :chart-data="datacollection"></BarChart>
  </div>
</template>

<script>
import BarChart from '@/components/admin/BarChart'
import DateTimePicker from 'vue-vanilla-datetime-picker'

export default {
    components: {
        BarChart,
        DateTimePicker
    },
    data () {
        return {
            selectedPeriod: new Date(),
            datacollection: null,
        }
    },
    computed: {
        daysInMonth () {
            return 32 - new Date(this.selectedPeriod.getFullYear(), this.selectedPeriod.getMonth(), 32).getDate()
        }
    },
    created () {
        this.fillChartData()
    },
    methods: {
        fillLabels (n) {
            const result = []
            for (let i = 0; i < n; i++) result.push(i + 1)
            return result
        },
        updateAdminVisitsData () {
            this.$socket.emit('getAdminVisitsData', { year: this.selectedPeriod.getFullYear(), month: this.selectedPeriod.getMonth() + 1 })
        },
        fillChartData (ipStat) {
            const newUsers = (new Array(this.daysInMonth)).fill(0)
            const visits = (new Array(this.daysInMonth)).fill(0)
            
            this.datacollection = {
                labels: this.fillLabels(this.daysInMonth),
                datasets: [
                    {
                        label: 'Новые поьзователи',
                        backgroundColor: 'green',
                        data: newUsers
                    }, {
                        label: 'Посещения',
                        backgroundColor: 'blue',
                        data: visits
                    }
                ]
            }

            // If ipStat not array then exit
            if (!ipStat || !Array.isArray(ipStat)) {
                return
            }

            for (let i = 0; i < ipStat.length; i++) {
                const date = ipStat[i].date
                newUsers[date - 1] = ipStat[i].newUsers
                visits[date - 1] = ipStat[i].visits
            }

        }
    },
    sockets: {
        getAdminVisitsDataSuccess (data) {
            this.fillChartData(data.ipStat)
        }
    }
}
</script>

<style lang="scss">
@import "node_modules/vue-vanilla-datetime-picker/dist/DateTimePicker";

.ip-stat {
    &__select-period {
        text-align: left;
        margin: 0 0 30px 0;
        color: #000;
        .time-picker__button {
            display: none;
        }
    }
}

</style>
<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    name: 'BarChart',
    extends: Bar,
    mixins: [reactiveProp],
    data () {
        return {
            options: options
        }
    },
    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            stacked: true,
            gridLines: {
                color: '#444'
            }
        }],
        yAxes: [{
            stacked: false,
            gridLines: {
                color: '#444'
            }
        }],
    }
}
</script>

<style lang="scss">
/*
.chartjs-size-monitor {
    max-height: 80%;
}
*/
</style>
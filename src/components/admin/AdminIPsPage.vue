<template>
    <div class="admin-ips-page">
        <table>
            <thead>
                <tr>
                    <th>N</th>
                    <th>IP</th>
                    <th>Страна</th>
                    <th>Кол-во посещений</th>
                    <th>Создан</th>
                    <th>Обновлён</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(ip, index) in ips"
                    :key="'i' + index"
                >
                    <td>{{ index + 1 }}</td>
                    <td>{{ ip.ip }}</td>
                    <td>{{ ip.country }}</td>
                    <td>{{ ip.cnt }}</td>
                    <td>{{ ip.created | date }}</td>
                    <td>{{ ip.updated | date }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'AdminIPsPage',
    data () {
        return {
            ips: []
        }
    },
    methods: {
        updateAdminIPsData () {
            this.$socket.emit('getAdminIPsData', {})
        }
    },
    mounted () {
        this.updateAdminIPsData()
    },
    sockets: {
        getAdminIPsDataSuccess (data) {
            this.ips = data
        }
    },
    filters: {
        date (value) {
            if (!value) return
            return moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY');
        }
    }
}
</script>

<style lang="scss">
.admin-ips-page {
    padding-top: 20px;
    table {
        width: 100%;
        font-size: 12px;
        margin: 10px 0 30px 0;
        tr {
            width: 100%;
            th, td {
                border: 1px solid #777;
                padding: 10px 5px;
                vertical-align: middle;
                &:nth-child(1),
                &:nth-child(4),
                &:nth-child(5),
                &:nth-child(6) {
                    width: 40px;
                }
                &:nth-child(2) {
                    width: 300px;
                }
            }
            th {
                color: #228CCD;
            }
        }
    }
}
</style>

const fetch = require("node-fetch")
const {prefix} = require("../config/vars.json")

module.exports = {

    name: "derpibooru",
    alias: ["derpi", "derpy", "db"],
    description: "Busca imágenes en derpibooru usando tags separados por coma.",

    async execute(message, args, cmdname) {
        async function getData(url) {
            const response = await fetch(url)
            if (response.status == 200) {
                return response.json()
            } else {
                throw new Error(response.statusText)
            }
        }

        arg = message.content.replace(prefix + cmdname, "").trim()
        if (!arg) {
            arg = "*"
        }
        
        const safe = 100073

        if (arg.split(",").length = 1 && !isNaN(arg)) {
            const id_url = `https://derpibooru.org/api/v1/json/images/${arg}?`
            let id_params = new URLSearchParams({
                filter_id: safe
            })
            let id_data = await getData(id_url + id_params).then(function () {
                    message.channel.send(`https://derpibooru.org/images/${arg}`)
                    return
                })
                .catch(reason => {
                    message.channel.send(`Se ha producido un error en la búsqueda: ${reason.message}`)
                    return
                })
            return
        }

        const url = "https://derpibooru.org/api/v1/json/search/images?"
        let params = new URLSearchParams({
            q: arg,
            filter_id: safe,
            per_page: 1,
            page: 1
        })

        message.channel.startTyping()

        let data = await getData(url + params)
        let res = []
        let total_img = data["total"]

        rand_img = Math.floor(Math.random() * total_img + 1)
        params.set("page", rand_img.toString())

        if (total_img == 0) {
            return message.channel.send("No se han encontrado resultados para esta búsqueda.")
        } else if (data["error"]) {
            return message.channel.send(`Se ha producido un error en la búsqueda: ${data["error"]}`)
        } else if (total_img > 1){
            res.push(`Se han encontrado **${total_img}** imágenes en total. [${rand_img}/${total_img}]`)
        }

        data = await getData(url + params)
        res.push(`https://derpibooru.org/images/${data["images"][0].id}`)

        message.channel.send(res)
        message.channel.stopTyping()

    },
}
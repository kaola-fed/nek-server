const categoryList = [
    {
        "_id": "582ecc73bfc09908e38b79ef",
        "createdAt": "2016-11-18T09:40:03.815Z",
        "name": "日期类",
        "updatedAt": "2016-11-18T11:54:40.616Z",
        "componentList": []
    }, {
        "_id": "582eccaebfc09908e38b79f0",
        "createdAt": "2016-11-18T09:41:02.554Z",
        "name": "表单类",
        "updatedAt": "2016-11-18T11:54:23.737Z",
        "componentList": [
            {
                "_id": "582ee47ebfc09908e38b79f6",
                "project": "582ec571bfc09908e38b79dd",
                "createdAt": "2016-11-18T11:22:38.047Z",
                "category": "582eccaebfc09908e38b79f0",
                "desc": "按钮",
                "name": "ui.button",
                "id": 123,
                "updatedAt": "2016-11-18T11:22:38.047Z",
                "conf": [
                    {
                        "_id": "582ee47ebfc09908e38b79f8",
                        "desc": "标题",
                        "key": "title",
                        "selects": [],
                        "type": "string",
                        "value": "点我"
                    }, {
                        "_id": "582ee47ebfc09908e38b79f7",
                        "desc": "类型",
                        "key": "type",
                        "selects": [
                            "default",
                            "primary",
                            "info",
                            "success",
                            "warning",
                            "error"
                        ],
                        "type": "select",
                        "value": "default"
                    }
                ],
                "cols": 1
            }
        ]
    }, {
        "_id": "582eccbebfc09908e38b79f1",
        "createdAt": "2016-11-18T09:41:18.849Z",
        "name": "模块",
        "updatedAt": "2016-11-18T09:41:18.849Z",
        "componentList": [
            {
                "_id": "582ef0c549026c23157f4d4e",
                "project": "582ec571bfc09908e38b79dd",
                "createdAt": "2016-11-18T12:15:01.958Z",
                "category": "582eccbebfc09908e38b79f1",
                "desc": "模块",
                "name": "container",
                "id": 999999,
                "updatedAt": "2016-11-18T12:15:01.958Z",
                "conf": [],
                "cols": 12
            }
        ]
    }
];

export default categoryList;

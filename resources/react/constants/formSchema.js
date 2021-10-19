export const schema = [
    {
        name: '라벨',
        icon: 'text',
        property: {
            type: 'label',
            label: '라벨',
            bold: true
        }
    },
    {
        name: '입력박스',
        icon: 'text',
        property: {
            type: 'input',
            label: '입력박스 라벨',
            bold: true,
            placeholder: 'PlaceHolder',
            value: ''
        }
    },
    {
        name: '첵크박스',
        icon: 'check',
        property: {
            type: 'checkbox',
            label: '첵크박스 라벨',
            bold: true,
            defaultText: '첵크',
            defaultParam: {value: false, text: ''},
            params: [
                {value: false, text: ''},
                {value: false, text: ''},
                {value: false, text: ''}
            ]
        }
    },
    {
        name: '라디오옵션',
        icon: 'radio',
        property: {
            type: 'radio',
            label: '라디오옵션 라벨',
            bold: true,
            defaultText: '라디오',
            defaultParam: {value: false, text: ''},
            params: [
                {value: false, text: ''},
                {value: false, text: ''},
                {value: false, text: ''}
            ]
        }
    },
    {
        name: '파일',
        icon: 'file',
        property: {
            type: 'file',
            label: '파일첨부 라벨',
            defaultPlaceholder: "",
            defaultParam: {fileName: '', btn: '첨부하기', placeholder: ""},
            params: [
                {fileName: '', value: '', btn: '첨부하기', placeholder: ""},
                {fileName: '', value: '', btn: '첨부하기', placeholder: ""},
                {fileName: '', value: '', btn: '첨부하기', placeholder: ""},
            ]
        }
    },
];
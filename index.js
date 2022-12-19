import express from 'express';

const app = express();

let records = [];
const createRecord = (name, parent) => {
    const record = { name, parent };
    records.push({
        name,
        parent,
        id: Number(name)
    });
    return record;
}

const createData = [
    ["1", null],
    ["2", 1],
    ["3", 2],
    ["4", 3],
    ["5", 2],
    ["6", 5],
    ["7", 6],
    ["8", 6],
    ["9", 8],
    ["13", 7],
    ["10", 1],
    ["11", 10],
    ["12", 10],
]

createData.forEach(data => {
    createRecord(data[0], data[1]);
});

const selectedRecordsId = ["4", "7", "10"];

const getSelectedAncestors = (selectedRecords) => {
    const selectedAncestors = [];
    selectedRecords.forEach(record => {
        const selectedRecord = records.find(r => r.name === record);
        let parent = selectedRecord.parent;
        while (parent) {
            const parentRecord = records.find(r => r.id === parent);
            selectedAncestors.push(parentRecord);
            parent = parentRecord.parent;
        }
    });

    return [...new Set(selectedAncestors)];
}

const getSelectedChildren = (selectedRecords) => {
    const selectedChildren = [];
    selectedRecords.forEach(record => {
        const selectedRecord = records.find(r => r.name === record);
        const children = records.filter(r => r.parent === selectedRecord.id);
        children.forEach(child => {
            selectedChildren.push(child);
        });
    });
    return [...new Set(selectedChildren)];
}

// console.log('All Records: ', records);
console.log('Selected Record Ids: ', selectedRecordsId);
console.log('Selected Ancestors: ', getSelectedAncestors(selectedRecordsId));
console.log('Selected Children: ', getSelectedChildren(selectedRecordsId));

const selectedRecords = records.filter(r => selectedRecordsId.includes(r.name));
const mergedRecords = [...selectedRecords, ...getSelectedAncestors(selectedRecordsId), ...getSelectedChildren(selectedRecordsId)];

console.log('Merged Records: ', mergedRecords);

const constructTree = (records) => {
    const tree = [];
    // if a record has no children, it's children property will be an empty array
    mergedRecords.forEach(record => {
        const parent = records.find(r => r.id === record.parent);
        if (!parent) {
            tree.push(record);
        } else {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(record);
        }
    });

    // loop nested children
    const loopChildren = (children) => {
        children.forEach(child => {
            if (child.children) {
                loopChildren(child.children);
            } else {
                child.children = [];
            }
        });
    }

    loopChildren(tree);

    return tree;
}

app.get('/', (req, res) => {
    res.json(constructTree(mergedRecords));
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
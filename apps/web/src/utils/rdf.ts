import type { NamedNode, Store } from "oxigraph";
import allNodes from '../data/all-nodes.csv';
import allRels from '../data/all-rels.csv';

const IRI = "http://_";
let RDF = "";

for (const { id, value, labels } of (allNodes as { id: string, value: string, labels: string }[])) {
    RDF += `${nodeIRI(id)} ${asIRI('value')} "${value.trim()}".\n`;
    RDF += `${nodeIRI(id)} ${asIRI('label')} "${labels.trim()}".\n`;
}

for (const { from, rel, to } of (allRels as { from: string, rel: string, to: string }[])) {
    RDF += `${nodeIRI(from)} ${relIRI(rel)} ${nodeIRI(to)}. \n`
}

export function nodeIRI(id: string) {
    return asIRI(`n/${id}`);
}

export function relIRI(value: string) {
    return asIRI(`r/${value}`);
}

export function asIRI(value: string) {
    return `<${IRI}/${value}>`;
}

export function query(q: string, debug = false): Map<string, NamedNode>[] {
    if (debug) {
        console.info(q);
    }

    return getStore().query(q);
}

export function loadRDF() {
    getStore().load(RDF,
        {
            format: "application/n-triples",
        },
    );
}

function getStore(): Store {
    return (window.global as unknown as { oxigraphStore: Store })?.oxigraphStore;
}

export function getRandomNodeValue(): string {
    while (true) {
        const node = allNodes[Math.floor(Math.random() * (allNodes.length - 1))];

        if (node.labels !== 'Document') {
            return node.value;
        }
    }
}
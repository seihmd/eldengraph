import "neo4j-driver";
import {
    LLMGraphTransformer,
} from "@langchain/community/experimental/graph_transformers/llm";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

import type { GraphDocument } from "@langchain/community/dist/graphs/graph_document";
import { ChatOpenAI } from "@langchain/openai";
import { getPrompt } from "./prompt";

export const llm = new ChatOpenAI({
    temperature: 0,
    model: "gpt-4o",
    verbose: true,
});

const graph = await Neo4jGraph.initialize({
    url: "bolt://localhost:7687",
    username: "neo4j",
    password: "password",
});

export const getGraphDocuments = async (texts: string[], about: string) => {
    const llmGraphTransformer = new LLMGraphTransformer({
        llm,
        prompt: getPrompt(about),
    });

    return await llmGraphTransformer.convertToGraphDocuments(
        texts.map((doc, i) => ({
            pageContent: doc,
            metadata: { subject: doc.split(":")[0], text: doc.split(":")[1] },
        })),
    );
}

export const addGraphDocuments = async (result: GraphDocument[]) => {
    result.forEach(r => {
        r.nodes.forEach(node => {
            console.log(node)
        })
        r.relationships.forEach(rel => {
            console.log(rel)
        })

        console.log(r)
    });
    await graph.addGraphDocuments(result, {
        baseEntityLabel: true,
        includeSource: true,
    });
};

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_NODES 100

// A graph is represented using an adjacency list
struct Node {
    int vertex;
    struct Node* next;
};

struct Graph {
    int numVertices;
    struct Node** adjLists;
    bool* visited;
};

// Create a new node
struct Node* createNode(int v) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->vertex = v;
    newNode->next = NULL;
    return newNode;
}

// Create a graph
struct Graph* createGraph(int vertices) {
    struct Graph* graph = malloc(sizeof(struct Graph));
    graph->numVertices = vertices;
    graph->adjLists = malloc(vertices * sizeof(struct Node*));
    graph->visited = malloc(vertices * sizeof(bool));
    
    for (int i = 0; i < vertices; i++) {
        graph->adjLists[i] = NULL;
        graph->visited[i] = false;
    }
    
    return graph;
}

// Add edge to the graph (undirected)
void addEdge(struct Graph* graph, int src, int dest) {
    struct Node* newNode = createNode(dest);
    newNode->next = graph->adjLists[src];
    graph->adjLists[src] = newNode;
    
    newNode = createNode(src);
    newNode->next = graph->adjLists[dest];
    graph->adjLists[dest] = newNode;
}

// DFS function to check connectivity
bool DFS(struct Graph* graph, int vertex, int endVertex) {
    graph->visited[vertex] = true;
    
    if (vertex == endVertex) {
        return true;
    }
    
    struct Node* temp = graph->adjLists[vertex];
    
    while (temp) {
        int adjVertex = temp->vertex;
        
        if (!graph->visited[adjVertex]) {
            if (DFS(graph, adjVertex, endVertex)) {
                return true;
            }
        }
        temp = temp->next;
    }
    
    return false;
}

// Main function to check connectivity using DFS
bool isConnectedDFS(struct Graph* graph, int startVertex, int endVertex) {
    for (int i = 0; i < graph->numVertices; i++) {
        graph->visited[i] = false;
    }
    
    return DFS(graph, startVertex, endVertex);
}

// Main function
int main() {
    struct Graph* graph = createGraph(6);
    
    addEdge(graph, 0, 1);
    addEdge(graph, 0, 2);
    addEdge(graph, 1, 3);
    addEdge(graph, 1, 4);
    addEdge(graph, 2, 4);
    addEdge(graph, 3, 5);
    
    int startNode = 0, endNode = 5;
    
    if (isConnectedDFS(graph, startNode, endNode)) {
        printf("There is a path between node %d and node %d\n", startNode, endNode);
    } else {
        printf("There is no path between node %d and node %d\n", startNode, endNode);
    }
    
    return 0;
}

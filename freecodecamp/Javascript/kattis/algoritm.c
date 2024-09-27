#include <stdio.h>
#include <stdlib.h>

// Structure for the adjacency list node
struct Node {
    int vertex; // The adjacent city (node)
    int weight; // Length of the road
    struct Node* next;
};

// Structure for the graph
struct Graph {
    int numVertices;            // Number of vertices (cities)
    struct Node** adjLists;     // Array of adjacency lists
};

// Function prototypes
struct Node* createNode(int v, int w);
struct Graph* createGraph(int vertices);
void addEdge(struct Graph* graph, int src, int dest, int weight);
void dfs(int current, int target, int* visited, struct Graph* graph, int currentOr, int* minCost);
void calculateCosts(struct Graph* graph, int q, int* results);
void freeGraph(struct Graph* graph); // Function prototype for freeGraph

// Function to create a new adjacency list node
struct Node* createNode(int v, int w) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->vertex = v; // The adjacent city (node)
    newNode->weight = w; // Length of the road
    newNode->next = NULL;
    return newNode;
}

// Function to create a graph with a given number of vertices
struct Graph* createGraph(int vertices) {
    struct Graph* graph = (struct Graph*)malloc(sizeof(struct Graph));
    graph->numVertices = vertices;

    // Create an array of adjacency lists
    graph->adjLists = (struct Node**)malloc(vertices * sizeof(struct Node*));

    // Initialize each adjacency list as empty
    for (int i = 0; i < vertices; i++) {
        graph->adjLists[i] = NULL;
    }
    return graph;
}

// Function to add a bidirectional edge to the graph with length
void addEdge(struct Graph* graph, int src, int dest, int weight) {
    // Convert to 0-based index
    int srcIndex = src - 1; // Adjusting for 1-based index
    int destIndex = dest - 1; // Adjusting for 1-based index

    // Add an edge from src to dest
    struct Node* newNode = createNode(destIndex, weight);
    newNode->next = graph->adjLists[srcIndex];
    graph->adjLists[srcIndex] = newNode;

    // Add an edge from dest to src (bidirectional)
    newNode = createNode(srcIndex, weight);
    newNode->next = graph->adjLists[destIndex];
    graph->adjLists[destIndex] = newNode;
}

// Function to perform DFS and find the minimum bitwise OR of road lengths
void dfs(int current, int target, int* visited, struct Graph* graph, int currentOr, int* minCost) {
    if (current == target) {
        if (currentOr < *minCost) {
            *minCost = currentOr; // Update minCost if current path OR is smaller
        }
        return;
    }

    visited[current] = 1; // Mark the current city as visited

    // Traverse the adjacency list of the current city
    struct Node* temp = graph->adjLists[current];
    while (temp) {
        if (!visited[temp->vertex]) { // If the city hasn't been visited
            // Calculate the new OR value for the path
            int newOrValue = currentOr | temp->weight;
            // Recursive DFS call
            dfs(temp->vertex, target, visited, graph, newOrValue, minCost);
        }
        temp = temp->next;
    }

    visited[current] = 0; // Backtrack
}

// Function to calculate the cost for sending crystals and store results
void calculateCosts(struct Graph* graph, int q, int* results) {
    for (int i = 0; i < q; i++) {
        int s, t;
        if (scanf("%d %d", &s, &t) != 2) { // Check for valid input
            printf("Invalid input for cities.\n");
            continue;
        }

        // Create a visited array for DFS
        int* visited = (int*)calloc(graph->numVertices, sizeof(int));
        int minCost = __INT_MAX__; // Initialize minCost to maximum integer value

        // Perform DFS to calculate the minimum cost
        dfs(s - 1, t - 1, visited, graph, 0, &minCost); 

        if (minCost != __INT_MAX__) {
            results[i] = minCost; // Store the result
        } else {
            results[i] = -1; // No path found
        }

        free(visited); // Free the visited array
    }
}

// Main function to demonstrate the graph implementation
int main() {
    int n, m;
    
     // Instructions for the user
    printf("Enter the number of cities (vertices) and the number of roads (edges):\n");

    // Input number of vertices (cities) and edges (roads)
    if (scanf("%d %d", &n, &m) != 2) {
        printf("Invalid input for vertices and edges.\n");
        return 1;
    }

    struct Graph* graph = createGraph(n); // Create a graph with n cities

  // Adding edges based on user input
    printf("Enter the roads (format: city1 city2 length):\n");
    for (int i = 0; i < m; i++) {
        int a, b, w;
        if (scanf("%d %d %d", &a, &b, &w) != 3) { // Check for valid input
            printf("Invalid input for road.\n");
            return 1;
        }
        // Here a and b are expected to be in the range [1, n]
        if (a >= 1 && a <= n && b >= 1 && b <= n) {
            addEdge(graph, a, b, w);
        }
    }

    // Input number of days to consider
    int q;
     printf("Enter the number of days to consider: ");
    if (scanf("%d", &q) != 1) { // Check for valid input
        printf("Invalid input for number of days.\n");
        return 1;
    }

    // Array to store results
    int* results = (int*)malloc(q * sizeof(int));

    // Calculate costs for crystal shipments

    printf("Enter the crystal shipments (format: city_from city_to):\n");
    calculateCosts(graph, q, results);

    // Print all results at once
    printf("the shortest distance is...\n");
    for (int i = 0; i < q; i++) {
        printf("%d\n", results[i]);
    }

    // Free allocated memory
    free(results); // Free the results array
    freeGraph(graph);

    return 0;
}

// Function to free the graph memory
void freeGraph(struct Graph* graph) {
    for (int i = 0; i < graph->numVertices; i++) {
        struct Node* temp = graph->adjLists[i];
        while (temp) {
            struct Node* toDelete = temp;
            temp = temp->next;
            free(toDelete);
        }
    }
    free(graph->adjLists);
    free(graph);
}

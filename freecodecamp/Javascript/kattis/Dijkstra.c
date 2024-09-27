#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define INF INT_MAX
/* Defines INF as the maximum possible integer (INT_MAX).
 This will be used to represent an infinite distance 
 for nodes that haven't been processed yet */

 /* Defines a MinHeapNode structure that stores two fields:
  vertex (node number) and distance (current distance from the source node). */

typedef struct {
    int vertex;
    int distance;
} MinHeapNode;

typedef struct {
    int size;  //stores current size of the heap
    int capacity;  //capacity of the heap
    int *pos; //Position of each vertex in the heap
    MinHeapNode **array; //An array of MinHeapNode* (pointers to min heap nodes).
} MinHeap;

// Function to create a new min heap node
/* A helper function that creates a new MinHeapNode
 by dynamically allocating memory using malloc */
MinHeapNode* newMinHeapNode(int v, int dist) {
    MinHeapNode* minHeapNode = (MinHeapNode*)malloc(sizeof(MinHeapNode));
    minHeapNode->vertex = v;
    minHeapNode->distance = dist;
    return minHeapNode;
}

// Function to create a min heap
/* A function that creates a new min heap with a given capacity.
 It allocates memory for the heap itself, for the position array (pos), and for the heap array (array */
MinHeap* createMinHeap(int capacity) {
    MinHeap* minHeap = (MinHeap*)malloc(sizeof(MinHeap)); // Allocate memory for a new MinHeap
    minHeap->pos = (int*)malloc(capacity * sizeof(int));  // Allocate memory for the position array
    minHeap->size = 0;  // Initialize the heap size to 0 (empty heap)
    minHeap->capacity = capacity; // Set the heap capacity
    minHeap->array = (MinHeapNode**)malloc(capacity * sizeof(MinHeapNode*)); // Allocate memory for the node array
    return minHeap; // Return the pointer to the new heap
}


// Function to swap two nodes of min heap
/* A function that swaps two MinHeapNode pointers. 
This is used during the heap operations to maintain the heap properties. */
void swapMinHeapNode(MinHeapNode** a, MinHeapNode** b) {
    MinHeapNode* t = *a;
    *a = *b;
    *b = t;
}

// Heapify a node at idx in the heap
/* This function maintains the min heap property after a node has been extracted or updated. 
It checks the left and right children of the node at idx and ensures the smallest node is at the top. 
If necessary, it swaps the nodes and recursively heapifies. */
void minHeapify(MinHeap* minHeap, int idx) {
    int smallest, left, right;
    smallest = idx; // Assume the current index is the smallest
    left = 2 * idx + 1; // Left child index in the heap array
    right = 2 * idx + 2; // Right child index in the heap array

    // Check if the left child is smaller than the current smallest node
    if (left < minHeap->size && minHeap->array[left]->distance < minHeap->array[smallest]->distance)
        smallest = left;

    // Check if the right child is smaller than the current smallest node
    if (right < minHeap->size && minHeap->array[right]->distance < minHeap->array[smallest]->distance)
        smallest = right;

    // If the smallest node is not the current node, swap it and heapify again
    if (smallest != idx) {
        MinHeapNode* smallestNode = minHeap->array[smallest];
        MinHeapNode* idxNode = minHeap->array[idx];

        minHeap->pos[smallestNode->vertex] = idx; // Update the position of the smallest node
        minHeap->pos[idxNode->vertex] = smallest; // Update the position of the current node

        swapMinHeapNode(&minHeap->array[smallest], &minHeap->array[idx]); // Swap nodes

        minHeapify(minHeap, smallest); // Recursively heapify the affected sub-tree
    }
}

// Extract minimum node from heap
MinHeapNode* extractMin(MinHeap* minHeap) {
    if (minHeap->size == 0)
        return NULL; // If the heap is empty, return NULL

    MinHeapNode* root = minHeap->array[0]; // Store the root node (smallest distance node)
    MinHeapNode* lastNode = minHeap->array[minHeap->size - 1]; // Get the last node in the heap
    minHeap->array[0] = lastNode; // Move the last node to the root

    minHeap->pos[root->vertex] = minHeap->size - 1; // Update the position of the root node
    minHeap->pos[lastNode->vertex] = 0; // Update the position of the last node

    --minHeap->size; // Reduce the size of the heap
    minHeapify(minHeap, 0); // Heapify from the root to maintain heap property

    return root; // Return the extracted node
}


// Decrease distance value of a given vertex
void decreaseKey(MinHeap* minHeap, int v, int dist) {
    int i = minHeap->pos[v]; // Get the current position of vertex v in the heap
    minHeap->array[i]->distance = dist; // Update the distance of vertex v

    // Move up in the heap while the current node's distance is less than its parent's
    while (i && minHeap->array[i]->distance < minHeap->array[(i - 1) / 2]->distance) {
        minHeap->pos[minHeap->array[i]->vertex] = (i - 1) / 2; // Update position of the current node
        minHeap->pos[minHeap->array[(i - 1) / 2]->vertex] = i; // Update position of the parent node
        swapMinHeapNode(&minHeap->array[i], &minHeap->array[(i - 1) / 2]); // Swap the current node with its parent

        i = (i - 1) / 2; // Move to the parent's index
    }
}


// Check if a given vertex is in min heap
int isInMinHeap(MinHeap *minHeap, int v) {
    if (minHeap->pos[v] < minHeap->size)
        return 1;
    return 0;
}

// Function to perform Dijkstra's algorithm
void dijkstra(int graph[9][9], int src, int V) {
    int dist[V]; // Output array. dist[i] will hold the shortest distance from src to i

    // minHeap represents set of vertices not yet finalized
    MinHeap* minHeap = createMinHeap(V);

    // Initialize min heap with all vertices. Distance of src is 0
    for (int v = 0; v < V; ++v) {
        dist[v] = INF;
        minHeap->array[v] = newMinHeapNode(v, dist[v]);
        minHeap->pos[v] = v;
    }

    // Make the distance of source vertex as 0 so that it is extracted first
    minHeap->array[src] = newMinHeapNode(src, dist[src]);
    minHeap->pos[src] = src;
    dist[src] = 0;
    decreaseKey(minHeap, src, dist[src]);

    // Initially size of min heap is equal to V
    minHeap->size = V;

    // In the following loop, min heap contains all nodes
    // whose shortest distance is not yet finalized.
    while (minHeap->size != 0) {
        // Extract the vertex with minimum distance value
        MinHeapNode* minHeapNode = extractMin(minHeap);
        int u = minHeapNode->vertex; // Store the extracted vertex number

        // Traverse through all adjacent vertices of u (the extracted vertex)
        // and update their distance values
        for (int v = 0; v < V; ++v) {
            // If v is not yet processed and there is an edge from u to v,
            // and total weight of path from src to v through u is smaller
            // than the current value of dist[v], update dist[v]
            if (graph[u][v] && isInMinHeap(minHeap, v) && dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                // Update distance value in min heap
                decreaseKey(minHeap, v, dist[v]);
            }
        }
    }

    // Print the calculated shortest distances
    printf("Vertex \t\t Distance from Source\n");
    for (int i = 0; i < V; ++i)
        printf("%d \t\t %d\n", i, dist[i]);
}

// Driver program to test the implementation
int main() {
    // Graph represented as an adjacency matrix
    int graph[9][9] = {
        { 0, 4, 0, 0, 0, 0, 0, 8, 0 },
        { 4, 0, 8, 0, 0, 0, 0, 11, 0 },
        { 0, 8, 0, 7, 0, 4, 0, 0, 2 },
        { 0, 0, 7, 0, 9, 14, 0, 0, 0 },
        { 0, 0, 0, 9, 0, 10, 0, 0, 0 },
        { 0, 0, 4, 14, 10, 0, 2, 0, 0 },
        { 0, 0, 0, 0, 0, 2, 0, 1, 6 },
        { 8, 11, 0, 0, 0, 0, 1, 0, 7 },
        { 0, 0, 2, 0, 0, 0, 6, 7, 0 }
    };

    dijkstra(graph, 0, 9);

    return 0;
}

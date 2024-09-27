#include <stdio.h>
#define INF 99999  // A large number to represent infinity
/*  We use the value 99999 to represent "infinity" because Floyd-Warshall works with an adjacency matrix 
where some vertices may not be directly connected. 
We can't use actual infinity, so we choose a large value (99999) to simulate it. */
#define V 4        // Number of vertices (cities)

// Function to print the shortest distance matrix
/* It loops through each cell in the dist matrix.
If the distance is equal to INF (meaning there is no direct path between the vertices), it prints "INF".
Otherwise, it prints the distance between the vertices.
printf("%7d", dist[i][j]); is used to ensure the output is properly formatted,
 with each number being right-aligned within 7 spaces. */
void printSolution(int dist[V][V]) {
    printf("The following matrix shows the shortest distances between every pair of vertices:\n");
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (dist[i][j] == INF)
                printf("%7s", "INF");
            else
                printf("%7d", dist[i][j]);
        }
        printf("\n");
    }
}

// Floyd-Warshall algorithm to find shortest paths
void floydWarshall(int graph[V][V]) { //int graph[V][V] for adjacency matrix
    int dist[V][V]; // Distance matrix to store the shortest distances

    // Initialize the distance matrix as the same as the input graph matrix
    for (int i = 0; i < V; i++) 
        for (int j = 0; j < V; j++) 
            dist[i][j] = graph[i][j];   //graph[i][j] holds the distance from vertex i to vertex j. If there's no direct edge between two vertices, we set the distance to INF (a large number to simulate infinity)

    // Dynamic programming: Calculate shortest paths
    /* The algorithm iterates over all possible pairs of vertices and checks whether there’s
     a shorter path between them by passing through an intermediate vertex k */
    for (int k = 0; k < V; k++) { //first loop
        /* k represents an intermediate vertex. The algorithm checks 
        if including this intermediate vertex results in a shorter path between other vertices. */
        // Pick all vertices as source one by one
        for (int i = 0; i < V; i++) { //second loop
            // Pick all vertices as destination for the above source
            for (int j = 0; j < V; j++) { //third loop
                // If the vertex `k` is on the shortest path from `i` to `j`,
                // update the value of `dist[i][j]`
                /* For each pair (i, j), it checks whether dist[i][k] + dist[k][j] < dist[i][j].
                 If true, it updates dist[i][j] with the shorter distance. */
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }

    // Print the shortest distance matrix
    /* After running the algorithm, we print the final distance matrix, 
    where each entry dist[i][j] contains the shortest distance between vertex i and vertex j */
    printSolution(dist);
}

int main() {
    // Example graph with 4 vertices and weights (direct distances)
    // If there's no direct connection, we use INF (infinity)
    int graph[V][V] = {
        {0, 3, INF, 5},
        {2, 0, INF, 4},
        {INF, 1, 0, INF},
        {INF, INF, 2, 0}
    };

    // Run Floyd-Warshall algorithm
    floydWarshall(graph);

    return 0;
}

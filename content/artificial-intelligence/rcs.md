# Recommendation Systems

## History

- **Early 1990s:** Introduction of Basic Collaborative Filtering
- **Late 1990s:** Emergence of Content-based Filtering
- **Early 2000s**: Rise of Hybrid Models
- **Late 2000s:** Deep Learning Approaches Begin to Emerge
- **2010s:** Context-aware & Knowledge-Based Systems Gain Popularity
- **2020s:** Focus on Reinforcement Learning & Explainable Recommenders

### Collaborative Filtering (CF)

- **Memory-based CF**: Uses the entire user-item dataset to generate a recommendation. It includes user-item filtering and item-item filtering.
- **Model-based CF:** Predictive models like neural networks, SVD, and matrix factorization are used to predict user’s interest, for example, predicting a user’s movie preference.

### Content-based Filtering

Uses item attributes to recommend items similar to what the user likes, based on their previous actions or explicit feedback, like suggesting a book based on a user’s past readings.

### Hybrid Models

Combines both collaborative and content-based filtering. For instance, Netflix uses a hybrid model to recommend movies and series.

### Deep Learning Approaches

- **AutoEncoders:** Neural networks that learn representations of user-item interactions.
- **RNNs:** Effective for session-based recommendations.
- **ConvNets:** Used for sequential recommendation.

### Context-aware Recommender Systems

Consider contextual information like location, time, and companion in recommendations, such as suggesting a restaurant nearby at lunchtime.

### Knowledge-Based Recommendation

Useful is when user-item interactions are sparse, making it hard to compute reliable recommendations, like suggesting niche products with limited interactions.

### Reinforcement Learning in Recommendations

Uses techniques like Multi-Armed Bandit to explore and exploit the recommendation space, optimizing for long-term user engagement.

### Explainable Recommender Systems

Provide reasons for a certain recommendation, building user trust by clarifying why a particular item is suggested.

### Multi-modal Recommendations

Use multiple types of information, such as textual, visual, and acoustic data, to recommend, like suggesting a movie based on its plot, poster, and theme music.

### Evolution and Personalization over Time

Refer to systems that adapt with user preferences over time, ensuring sustained user engagement.

### Privacy-preserving Recommendations

Integrate techniques like differential privacy into recommendation algorithms to protect user data.

## Challenges & Considerations in Recommender Systems

- **Cold start problem:** New users/items with no history.
- **Diversity vs. accuracy:** Balancing diverse recommendations against accurate ones.
- **Scalability:** Computational efficiency is key with millions of users and items.
- **Bias and fairness**: Ensuring unbiased and fair recommendations.

## Collaborative Filtering with ALS

Collaborative Filtering (CF) is a method that makes automatic predictions about the preference of a user by collecting preferences from many users (collaborating). **The underlying assumption is that if a person A has the same opinion as person B on an issue, A is more likely to have B’s opinion on a different issue.**

One of the model-based approaches for CF is the Alternating Least Squares (ALS) method. ALS is especially effective when dealing with implicit feedback, like clicks or views, rather than explicit ratings.

**Example:** If Alice frequently views movies A, B, and C, and Bob views movies A, B, and D, then CF using ALS might suggest movie C to Bob and movie D to Alice, based on their viewing patterns.

```python
import numpy as np
import implicit
from scipy.sparse import coo_matrix

# Sample data: user-item interactions
# (user_id, item_id, interaction_strength)
data = [
    (0, 'Movie A', 1),
    (0, 'Movie B', 1),
    (0, 'Movie C', 1),
    (1, 'Movie A', 1),
    (1, 'Movie B', 1),
    (1, 'Movie D', 1)
]

user_ids, item_ids, data = zip(*data)
unique_users = list(set(user_ids))
unique_items = list(set(item_ids))

rows = [unique_users.index(uid) for uid in user_ids]
cols = [unique_items.index(iid) for iid in item_ids]

interaction_matrix = coo_matrix((data, (rows, cols)))

# Train the ALS model
model = implicit.als.AlternatingLeastSquares(factors=50, regularization=0.01, iterations=20)
model.fit(interaction_matrix.T) # Note: .T because it expects item-user matrix

# Recommend items for a user
user_idx = unique_users.index(0)
recommended = model.recommend(user_idx, interaction_matrix)
print([unique_items[i[0]] for i in recommended])
```

## Content-based Filterings

Content-based Filtering (CBF) focuses on the attributes of items and gives you recommendations based on the comparison between the content of items and user preferences. This method uses item features to recommend additional items similar to what the user likes, based on their previous actions.

**Example:** If Alice liked several sci-fi movies with a futuristic theme, CBF would recommend other movies that match this profile.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Sample movie descriptions
movies = {
    ‘Movie A’: 'futuristic sci-fi thriller',
    ‘Movie B’: 'romantic comedy',
    ‘Movie C’: 'sci-fi with robots',
    ‘Movie D’: 'historical drama'
}

# Create a TF-IDF matrix
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(movies.values())

# Compute the cosine similarity matrix
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Get recommendations for a movie
def get_recommendations(title):
    idx = list(movies.keys()).index(title)
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    movie_indices = [i[0] for i in sim_scores[1:]]
    return [list(movies.keys())[i] for i in movie_indices]

print(get_recommendations(‘Movie A’))
```

## Survey

Traditional recommender systems follow Candidate Generation, Retrieval, and Ranking phases.
Unlike conventional models, LLMs do not require separate embeddings for each user/item interaction.
=> Instead, they use task-specific prompts encompassing user data, item information, and previous preferences.
=> This adaptability allows LLMs to generate recommendations directly, dynamically adapting to various contexts without explicit embeddings

## Todo

1. Collaborative Filtering (CF)

   - Resnick, P., & Varian, H. R. (1997). Recommender systems.
   - Sarwar, B. M., Karypis, G., Konstan, J. A., & Riedl, J. (2001). Item-based collaborative filtering recommendation algorithms.

2. Content-based Filtering

   - Pazzani, M. J., & Billsus, D. (2007). Content-based recommendation systems.

3. Hybrid Models

   - Burke, R. (2002). Hybrid recommender systems: Survey and experiments.

4. Deep Learning Approaches

   - Zhang, S., Yao, L., Sun, A., & Tay, Y. (2019). Deep learning based recommender system: A survey and new perspectives.

5. Context-aware Recommender Systems

   - Adomavicius, G., & Tuzhilin, A. (2015). Context-aware recommender systems.

6. Knowledge-Based Recommendation

   - Burke, R. (2000). Knowledge-based recommender systems.

7. Reinforcement Learning in Recommendations

   - Zhao, X., Zhang, W., & Wang, J. (2013). Interactive collaborative filtering.

8. Explainable Recommender Systems

   - Zhang, Y., & Chen, X. (2020). Explainable recommendation: A survey and new perspectives.

9. Multi-modal Recommendations

   - Elahi, M., Ricci, F., & Rubens, N. (2016). A survey of active learning in collaborative filtering recommender systems.

10. Evolution and Personalization over Time

    - Ding, Y., & Li, X. (2005). Time weight collaborative filtering.

11. Privacy-preserving Recommendations

    - Polat, H., & Du, W. (2003). Privacy-preserving collaborative filtering using randomized perturbation techniques.

| **Algorithm**                                                                  | **Type**                | **Description**                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alternating Least Squares (ALS)                                                | Collaborative Filtering | Matrix factorization algorithm for explicit or implicit feedback in large datasets, optimized for scalability and distributed computing capability. It works in the PySpark environment.                          |
| Attentive Asynchronous Singular Value Decomposition (A2SVD)\*                  | Collaborative Filtering | Sequential-based algorithm that aims to capture both long and short-term user preferences using attention mechanism. It works in the CPU/GPU environment.                                                         |
| Cornac/Bayesian Personalized Ranking (BPR)                                     | Collaborative Filtering | Matrix factorization algorithm for predicting item ranking with implicit feedback. It works in the CPU environment.                                                                                               |
| Cornac/Bilateral Variational Autoencoder (BiVAE)                               | Collaborative Filtering | Generative model for dyadic data (e.g., user-item interactions). It works in the CPU/GPU environment.                                                                                                             |
| Convolutional Sequence Embedding Recommendation (Caser)                        | Collaborative Filtering | Algorithm based on convolutions that aim to capture both user’s general preferences and sequential patterns. It works in the CPU/GPU environment.                                                                 |
| Deep Knowledge-Aware Network (DKN)\*                                           | Content-Based Filtering | Deep learning algorithm incorporating a knowledge graph and article embeddings for providing news or article recommendations. It works in the CPU/GPU environment.                                                |
| Extreme Deep Factorization Machine (xDeepFM)\*                                 | Collaborative Filtering | Deep learning based algorithm for implicit and explicit feedback with user/item features. It works in the CPU/GPU environment.                                                                                    |
| FastAI Embedding Dot Bias (FAST)                                               | Collaborative Filtering | General purpose algorithm with embeddings and biases for users and items. It works in the CPU/GPU environment.                                                                                                    |
| LightFM/Factorization Machine                                                  | Collaborative Filtering | Factorization Machine algorithm for both implicit and explicit feedbacks. It works in the CPU environment.                                                                                                        |
| LightGBM/Gradient Boosting Tree\*                                              | Content-Based Filtering | Gradient Boosting Tree algorithm for fast training and low memory usage in content-based problems. It works in the CPU/GPU/PySpark environments.                                                                  |
| LightGCN                                                                       | Collaborative Filtering | Deep learning algorithm which simplifies the design of GCN for predicting implicit feedback. It works in the CPU/GPU environment.                                                                                 |
| GeoIMC\*                                                                       | Collaborative Filtering | Matrix completion algorithm that takes into account user and item features using Riemannian conjugate gradient optimization and follows a geometric approach. It works in the CPU environment.                    |
| GRU                                                                            | Collaborative Filtering | Sequential-based algorithm that aims to capture both long and short-term user preferences using recurrent neural networks. It works in the CPU/GPU environment.                                                   |
| Multinomial VAE                                                                | Collaborative Filtering | Generative model for predicting user/item interactions. It works in the CPU/GPU environment.                                                                                                                      |
| Neural Recommendation with Long- and Short-term User Representations (LSTUR)\* | Content-Based Filtering | Neural recommendation algorithm for recommending news articles with long- and short-term user interest modeling. It works in the CPU/GPU environment.                                                             |
| Neural Recommendation with Attentive Multi-View Learning (NAML)\*              | Content-Based Filtering | Neural recommendation algorithm for recommending news articles with attentive multi-view learning. It works in the CPU/GPU environment.                                                                           |
| Neural Collaborative Filtering (NCF)                                           | Collaborative Filtering | Deep learning algorithm with enhanced performance for user/item implicit feedback. It works in the CPU/GPU environment.                                                                                           |
| Neural Recommendation with Personalized Attention (NPA)\*                      | Content-Based Filtering | Neural recommendation algorithm for recommending news articles with personalized attention network. It works in the CPU/GPU environment.                                                                          |
| Neural Recommendation with Multi-Head Self-Attention (NRMS)\*                  | Content-Based Filtering | Neural recommendation algorithm for recommending news articles with multi-head self-attention. It works in the CPU/GPU environment.                                                                               |
| Next Item Recommendation (NextItNet)                                           | Collaborative Filtering | Algorithm based on dilated convolutions and residual network that aims to capture sequential patterns. It considers both user/item interactions and features. It works in the CPU/GPU environment.                |
| Restricted Boltzmann Machines (RBM)                                            | Collaborative Filtering | Neural network based algorithm for learning the underlying probability distribution for explicit or implicit user/item feedback. It works in the CPU/GPU environment.                                             |
| Riemannian Low-rank Matrix Completion (RLRMC)\*                                | Collaborative Filtering | Matrix factorization algorithm using Riemannian conjugate gradients optimization with small memory consumption to predict user/item interactions. It works in the CPU environment.                                |
| Simple Algorithm for Recommendation (SAR)\*                                    | Collaborative Filtering | Similarity-based algorithm for implicit user/item feedback. It works in the CPU environment.                                                                                                                      |
| Self-Attentive Sequential Recommendation (SASRec)                              | Collaborative Filtering | Transformer based algorithm for sequential recommendation. It works in the CPU/GPU environment.                                                                                                                   |
| Short-term and Long-term Preference Integrated Recommender (SLi-Rec)\*         | Collaborative Filtering | Sequential-based algorithm that aims to capture both long and short-term user preferences using attention mechanism, a time-aware controller and a content-aware controller. It works in the CPU/GPU environment. |
| Multi-Interest-Aware Sequential User Modeling (SUM)\*                          | Collaborative Filtering | An enhanced memory network-based sequential user model which aims to capture users' multiple interests. It works in the CPU/GPU environment.                                                                      |
| Sequential Recommendation Via Personalized Transformer (SSEPT)                 | Collaborative Filtering | Transformer based algorithm for sequential recommendation with User embedding. It works in the CPU/GPU environment.                                                                                               |
| Standard VAE                                                                   | Collaborative Filtering | Generative Model for predicting user/item interactions. It works in the CPU/GPU environment.                                                                                                                      |
| Surprise/Singular Value Decomposition (SVD)                                    | Collaborative Filtering | Matrix factorization algorithm for predicting explicit rating feedback in small datasets. It works in the CPU/GPU environment.                                                                                    |
| Term Frequency - Inverse Document Frequency (TF-IDF)                           | Content-Based Filtering | Simple similarity-based algorithm for content-based recommendations with text datasets. It works in the CPU environment.                                                                                          |
| Vowpal Wabbit (VW)\*                                                           | Content-Based Filtering | Fast online learning algorithms, great for scenarios where user features / context are constantly changing. It uses the CPU for online learning.                                                                  |
| Wide and Deep                                                                  | Collaborative Filtering | Deep learning algorithm that can memorize feature interactions and generalize user features. It works in the CPU/GPU environment.                                                                                 |
| xLearn/Factorization Machine (FM) & Field-Aware FM (FFM)                       | Collaborative Filtering | Quick and memory efficient algorithm to predict labels with user/item features. It works in the CPU/GPU environment.                                                                                              |

**NOTE**: \* indicates algorithms invented/contributed by Microsoft.

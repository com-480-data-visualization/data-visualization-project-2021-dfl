# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Dora Lourenço  | 331202 |
| Loïc Busson    | 283671 |
| Francis Murray | 302071 |

[Milestone 1](milestones/Milestone1.md) • [Milestone 2](milestones/Milestone_2.pdf) • [Milestone 3](milestones/Milestone3.pdf)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to set up goals for our final project and assess the feasibility of our ideas (you will find it [here](milestones/Milestone1.md)).

In this [Milestone 1](milestones/Milestone1.md), you will find information about the followings:

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**

- [Process book](milestones/Milestone3.pdf)
- [Video](https://www.youtube.com/watch?v=vla4OJxy5Pk)

### Instalation

Our website is available at [GithubPages](https://com-480-data-visualization.github.io/data-visualization-project-2021-dfl/).

To run it locally, start an HTTP server by using:

``` python3 -m http.server ```

### Repository structure

- data: constains all the datasets that we use
- src: code of the website
- milestones: reports for each milestone
- images: images used in the reports

### Usage

#### Map

The map shows the value of total GHG emissions for each country for each year. You can zoom and pan on the map. As you hover over it the names of the countries show up. If you click on a country, that countries information will show up in the area plot, its bar filled with blue in the ranking plot and some more detailed information will show up in a box bellow it. The time slider allows you to change the data on the map according to the corresponding selected year.

#### Area plot

The area plot shows the emissions over the time period of each gas (CO2, CH4 and M2O), including total of emissions, per country. The panel on the bottom allows you to brush, so that you can select some period of time that you might want to see in more detail. The country showed can be switched by clicking on the map or choosing a country from the dropdown menu above the plot. The vertical lines indicate when each phase of the agreement started and/or ended.

#### Ranking plot

The ranking plot allows us to see which countries performed better than others in each year. You can select the year using the time slider. By performing better, we mean reducing the most the emissions of GHG. The red lines show the Kyoto protocol target and how far the countries results are from reaching them or how much they surpassed them.











## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone


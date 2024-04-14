CREATE SCHEMA iam;
CREATE SCHEMA tournament;
CREATE SCHEMA guide;

CREATE TABLE iam.user (
    user__id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    steam_username VARCHAR(32),
    rating SMALLINT
);

CREATE TABLE iam.role (
    role__id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(50) NOT NULL
);

CREATE TABLE iam.user__role(
    user__id UUID NOT NULL,
    role__id UUID NOT NULL,
    CONSTRAINT fk_user__role_user FOREIGN KEY (user__id) REFERENCES iam.user(user__id),
    CONSTRAINT fk_user__role_role FOREIGN KEY (role__id) REFERENCES iam.role(role__id),
    PRIMARY KEY (user__id, role__id)
);

CREATE TABLE tournament.tournament (
    tournament__id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner__id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    max_player SMALLINT NOT NULL,
    CONSTRAINT fk_tournament_user FOREIGN KEY (owner__id) REFERENCES iam.user(user__id)
);

CREATE TABLE tournament.round (
    round__id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament__id UUID NOT NULL,
    stage SMALLINT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    first_player__id UUID NOT NULL,
    first_player_checkin TIMESTAMPTZ,
    first_player_result BOOLEAN,
    second_player__id UUID NOT NULL,
    second_player_checkin TIMESTAMPTZ,
    second_player_result BOOLEAN,
    CONSTRAINT fk_round_first_player FOREIGN KEY (first_player__id) REFERENCES iam.user(user__id),
    CONSTRAINT fk_round_second_player FOREIGN KEY (second_player__id) REFERENCES iam.user(user__id),
    CONSTRAINT fk_round_tournament FOREIGN KEY (tournament__id) REFERENCES tournament.tournament(tournament__id)
);

CREATE TABLE tournament.user__tournament (
     user__id UUID NOT NULL,
     tournament__id UUID NOT NULL,
     CONSTRAINT fk_user__tournament_user FOREIGN KEY (user__id) REFERENCES iam.user(user__id),
     CONSTRAINT fk_user__tournament_tournament FOREIGN KEY (tournament__id) REFERENCES tournament.tournament(tournament__id),
     PRIMARY KEY (user__id, tournament__id)
);

CREATE TABLE guide.guide (
     guide__id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user__id UUID NOT NULL,
     title VARCHAR(255) NOT NULL UNIQUE,
     content BPCHAR NOT NULL,
     CONSTRAINT fk_guide_user FOREIGN KEY (user__id) REFERENCES iam.user(user__id)
);

CREATE TABLE guide.comment (
   comment__id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user__id UUID NOT NULL,
   guide__id UUID NOT NULL,
   content BPCHAR NOT NULL,
   CONSTRAINT fk_comment_user FOREIGN KEY (user__id) REFERENCES iam.user(user__id),
   CONSTRAINT fk_comment_guide FOREIGN KEY (guide__id) REFERENCES guide.guide(guide__id)
);

CREATE TABLE guide.vote (
    user__id UUID NOT NULL,
    guide__id UUID NOT NULL,
    vote_value SMALLINT CHECK (vote.vote_value in (-1, 1 )) NOT NULL,
    PRIMARY KEY (user__id, guide__id),
    CONSTRAINT fk_vote_user FOREIGN KEY (user__id) REFERENCES iam.user(user__id),
    CONSTRAINT fk_vote_guide FOREIGN KEY (guide__id) REFERENCES guide.guide(guide__id)
);

